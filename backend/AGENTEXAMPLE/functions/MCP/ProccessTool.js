/* eslint-disable */
const { log, error } = require("firebase-functions/logger");
const { createMessageChat } = require("../support/chatAgentSupport");
const { toolDeclarations } = require("../LLM/declarations");

exports.generateProcessTool = async (functionCall, actualUser, metaData = {}) => {
  if (!functionCall || !functionCall.name || !functionCall.args) {
    console.error('Invalid function call format:', functionCall);

    return {
      success: false,
      message: 'Invalid function call format.',
      apiResponse: {},
      executionData: {},
    }
  }

  const { name, args } = functionCall;

  let apiResponse = {};
  let executionData = {};

  const toolFound = toolDeclarations.find(td => td.name === name);
  if (toolFound) {
    console.log(`Procesando ${name}: ${JSON.stringify(args, null, 2)}`);

    // mixpanel.track('function_call', {
    //   type: 'display_programs',
    //   userID: actualUser.uid,
    //   phoneNumber: actualUser.phoneNumber,
    //   payload: functionCall.args
    // });

    const info = { name, args };

    await createMessageChat(actualUser, 'model', info, 'text', false);

    apiResponse = await toolFound.tool(actualUser, args, metaData.fileURL, metaData.mimeType);
    executionData = { type: toolFound.type, success: apiResponse.success, message: apiResponse.message, result: apiResponse.result };

    const funcionResponse = {
      functionResponse: {
        apiResponse,
      }
    };


    await createMessageChat(actualUser, 'user', funcionResponse, 'text');
  } else {
    console.log(`Función no reconocida: ${name}`);

    return {
      success: false,
      message: `Función no reconocida: ${name}`,
      apiResponse,
      executionData,
    };
  }

  return {
    success: true,
    message: `Función ${name} ejecutada con éxito.`,
    apiResponse,
    executionData,
  };
}
/* eslint-enable */
