/* eslint-disable */
const axios = require('axios');
const admin = require("firebase-admin");
const uuid = require('uuid');
// const Mixpanel = require('mixpanel');
const { log, error } = require("firebase-functions/logger");
// const { user } = require('firebase-functions/v1/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { initVertexAiChat } = require('../LLM/chat');
const { typesTool } = require('../LLM/declarations');
const { createMessageChat } = require("../support/chatAgentSupport");
const { sendTextAgentMessage } = require("../messages/messages");
const { generateProcessTool } = require("./ProccessTool");
const { clearText } = require("../support/text");
const { MIX_TOKEN } = require("../config");

exports.generateMCPProcess = async (userPrompt, ownerPhoneNumber, actualUser, from, typeContent, fileURL, mimeType) => {
  // var mixpanel = Mixpanel.init(MIX_TOKEN, {
  //   debug: true,
  // });

  log(`👤 userPrompt: ${userPrompt}`);

  try {
    const chat = await initVertexAiChat(actualUser);

    let textToSend = '';
    let finalUserPrompt;

    if (typeContent === 'text') {
      log(`Enviando prompt texto: "${userPrompt}"`);
      await createMessageChat(actualUser, 'user', userPrompt, 'text', true);

      finalUserPrompt = userPrompt;
    } else if (typeContent === 'audio') {
      log(`Enviando prompt audio: "${fileURL}"`);

      await createMessageChat(actualUser, 'user', fileURL, mimeType, true, fileURL);

      const filePart = {
        file_data: {
          file_uri: fileURL,
          mime_type: mimeType,
        },
      };

      finalUserPrompt = [filePart];
    } else if (typeContent === 'image') {
      log(`Enviando prompt imagen: "${fileURL}"`);

      await createMessageChat(actualUser, 'user', userPrompt, mimeType, true, fileURL);

      finalUserPrompt = userPrompt;
    } else {
      log(`Enviando prompt ${typeContent}: "${fileURL || userPrompt}"`);
      await createMessageChat(actualUser, 'user', userPrompt, mimeType, true, fileURL);

      finalUserPrompt = userPrompt;
    }

    const functionResponsesToSend = [];
    const executionResults = [];
    const allFunctionCalls = [];
    let content = '';

    const MAX_FUNCTION_CALLS = 8;
    for (let i = 0; i < MAX_FUNCTION_CALLS; i++) {
      const promptToSend = i === 0 ? finalUserPrompt : functionResponsesToSend;

      if (!promptToSend ||
        (Array.isArray(promptToSend) && promptToSend.length === 0) ||
        (typeof promptToSend === 'string' && promptToSend.trim() === '')) {
        log('El prompt a enviar está vacío. Saliendo del bucle de llamadas a funciones.');
        break;
      }

      const response = (await chat.sendMessage(promptToSend)).response;
      log(`Response Vertex ${i + 1} / ${MAX_FUNCTION_CALLS}: ${JSON.stringify(response, null, 2)}`);

      const parts = response.candidates[0].content.parts;
      const functionCalls = parts.filter(part => part.functionCall);
      const partWithText = parts.find(p => p.text);

      if (partWithText && partWithText.text) content = partWithText.text;

      if (functionCalls && functionCalls.length > 0) {
        log(`Se detectaron ${functionCalls.length} function calls en la respuesta: ${JSON.stringify(functionCalls, null, 2)}`);

        const functionsCalleds = (await Promise.all(functionCalls.map(async ({ functionCall }) => {
          try {
            const metaData = { fileURL, mimeType };
            const { apiResponse, executionData } = await generateProcessTool(functionCall, actualUser, metaData);
            if (!apiResponse || !executionData) {
              console.error(`No se obtuvo apiResponse o executionData de la función ${functionCall.name}`);
              console.error(`Api Response: ${apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No se obtuvo apiResponse'}`);
              console.error(`Execution Data: ${executionData ? JSON.stringify(executionData, null, 2) : 'No se obtuvo executionData'}`);
              return null;
            }

            functionResponsesToSend.push({
              functionResponse: {
                name: functionCall.name, response: {
                  ...apiResponse,
                  mimeType: undefined,
                  mediaUrl: undefined,
                }
              }
            });
            executionResults.push(executionData);
            return functionCall;
          } catch (taskError) {
            log(`Error ejecutando ${functionCall.name}: ${taskError.message}`);
            return null;
          }
        }))).filter(fc => fc !== null);

        allFunctionCalls.push(...functionsCalleds);
      } else {
        log(`No se detectaron function calls en la respuesta. Iteracion actual: ${i + 1} / ${MAX_FUNCTION_CALLS}. Saliendo del bucle...`);
        break;
      }
      if (i === MAX_FUNCTION_CALLS - 1) {
        log(`Se alcanzó el número máximo (${MAX_FUNCTION_CALLS}) de llamadas a funciones. Saliendo del bucle.`);
        content = "Lo siento, necesito más información para ayudarte. ¿Podrías intentar nuevamente?";
      }
    }

    if (!content) {
      const finalResponse = (await chat.sendMessage(functionResponsesToSend)).response;
      const parts = finalResponse.candidates[0].content.parts;
      const partWithText = parts.find(p => p.text);
      const partWithFunctionCall = parts.find(p => p.functionCall);

      if (partWithText && partWithText.text) {
        content = partWithText.text;
      } else if (partWithFunctionCall) {
        content = "Lo siento, necesito más información para ayudarte. ¿Podrías intentar nuevamente?";
      } else {
        console.log(`No se encontró parte con texto en la respuesta final. ${JSON.stringify(finalResponse, null, 2)}`);
        content = "No hay respuesta por ser ejecución de herramienta.";
      }
    }

    if (allFunctionCalls && allFunctionCalls.length > 0) {
      if (functionResponsesToSend.length === allFunctionCalls.length) {
        const textoLimpio = clearText(content);

        const executionResultFound = executionResults.findLast(er => typesTool.includes(er.type));
        const executionResultWithMediaUrl = executionResultFound && executionResultFound.mediaUrl && executionResultFound.mediaMimeType ?
          executionResultFound :
          executionResults.find(er => er.mediaUrl && er.mediaMimeType) || null;
        if (executionResultFound) {
          log(`Se encontró al menos un executionResult de tipo herramienta: ${JSON.stringify(executionResultFound, null, 2)}`);

          // ------------------------------------------------------------
          // TODO: Procesamiento de las respuestas de las tools
          // ------------------------------------------------------------

          if (executionResultFound.type !== 'captureLeadAndNotifyAdvisor') {
            await sendTextAgentMessage(textoLimpio, actualUser.phoneNumber, '', actualUser.uid);
          }

        } else {
          console.warn('No se encontraron executionResults de tipo herramienta.');
        }

        await createMessageChat(
          actualUser,
          'model',
          textoLimpio,
          'text',
          false,
          executionResultWithMediaUrl ? executionResultWithMediaUrl.mediaUrl : '',
        );

      } else {
        textToSend = "Hubo un problema al procesar todas las acciones solicitadas.";
        await sendTextAgentMessage(textToSend, actualUser.phoneNumber, '', actualUser.uid);

        await createMessageChat(actualUser, 'model', textToSend, 'text');
      }

    } else {
      const textoLimpio = clearText(content);

      await sendTextAgentMessage(textoLimpio, actualUser.phoneNumber, '', actualUser.uid);

      await createMessageChat(actualUser, 'model', textoLimpio, 'text');
    }

    return textToSend;

  } catch (error) {

    let completeError = error.stack;
    if (error.response) {
      log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
      log(`Error response status: ${error.response.status}`);
      log(`Error response headers: ${JSON.stringify(error.response.headers, null, 2)}`);
      completeError = error.response.data;
    } else if (error.request) {
      // Si no hubo respuesta, pero se envió una solicitud
      log(`No response received. Request details: ${JSON.stringify(error.request, null, 2)}`);
      completeError = error.request;
    } else {
      // Si el error ocurrió antes de enviar la solicitud
      log(`Error setting up the request: ${error.message}`);
      completeError = error.stack;
    }

    // Opcional: Imprime el stack trace completo para depuración
    log(`completeError: ${completeError}`);

    // mixpanel.track('error_log', {
    //     section: 'Error o con la función en cloud functions o una petición mal formateada de MCP testing',
    //     companyID: '',
    //     userID: actualUser.uid,
    //     function: 'generateMCPProcess',
    //     error: `${completeError}`,
    //   });
    console.error('Error:', error);
    // mixpanel.track('endBusinessPrompt', {});
    //return res.json({status: 503,error: {message: `Error from server gemini model: ${error}`}});
    //return `Error from server gemini model: ${error}`;
    //return `Lo sentimos, ocurrió un error y no pudimos procesar tu petición. Inténtalo de nuevo más tarde`;
    let sendMessage = `No logré entender lo que me quieres decir…`;
    sendMessage = `${sendMessage}\n\n¿Podrías intentar nuevamente? 🔄`;
    let responseInfo = { status: 'Enviar', message: sendMessage };

    await sendTextAgentMessage(sendMessage, actualUser.phoneNumber, '', actualUser.uid);

    let resultSaveUserMsn = '';
    if (typeContent === 'text') {
      resultSaveUserMsn = await createMessageChat(actualUser, 'user', userPrompt, 'text');
    } else if (typeContent === 'audio') {
      resultSaveUserMsn = await createMessageChat(actualUser, 'user', fileURL, mimeType);
    } else if (typeContent === 'image') {
      resultSaveUserMsn = await createMessageChat(actualUser, 'user', fileURL, mimeType);
    }
    log(`resultSaveUserMsn: ${resultSaveUserMsn}`);

    let resultSaveModelMsn = await createMessageChat(actualUser, 'model', sendMessage, 'text');
    log(`resultSaveModelMsn: ${resultSaveModelMsn}`);

    return responseInfo;

    //return res.json({status: 501,data: {message: 'Error al intentar realizar petición a gemini', response: error,}});
  }
}
/* eslint-enable */
