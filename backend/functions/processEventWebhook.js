/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { log, error } = require("firebase-functions/logger");
const axios = require("axios");
const admin = require("firebase-admin");
// const Mixpanel = require("mixpanel");
const uuid = require("uuid");
const functions = require("firebase-functions");

const { sendTypingIndicatorToUser, checkMessageID, createMessageIDRegister } = require("./support/support");

const { sendTextAgentMessage } = require("./messages/messages");

//? Importación de funciones de procesamiento de mensajes
const { handleAudioMessage } = require("./handlers/handleAudioMessage");
const { handleTextMessage } = require("./handlers/handleTextMessage");
const { handleImageMessage } = require("./handlers/handleImageMessage");
const { handleButtonReplyMessage } = require("./handlers/handleButtonReplyMessage");
const { handleNfmMessage } = require("./handlers/handleNfmMessage");

const { registerUser } = require("./support/support");
const { MIX_TOKEN, AGENT_ID } = require("./config");

exports.processChikasNailsWebhook = functions.https.onRequest(async (req, res) => {

  // var mixpanel = Mixpanel.init(MIX_TOKEN, {
  //   debug: true,
  // });

  console.log("request.body: ", req.body);

  let body = req.body;

  // Intentar parsear si es string
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      logger.error("Error parsing req.body as JSON", err);
      return res.status(400).send("Formato inválido");
    }
  }

  // Si no tiene entry, intentar desde req.body.data
  if (!body?.entry?.[0]) {
    body = req.body?.data;
    if (!body?.entry?.[0]) {
      return res.status(400).send("Formato inválido");
    }
  }

  logger.info(`Type of body: ${typeof body}`);

  try {
    const changes = body.entry[0].changes || [];

    for (const change of changes) {
      if (change.value?.messages) {
        const messages = change.value.messages;

        for (const message of messages) {
          const senderPhoneNumber = message.from;
          const textBody = message.text ? message.text.body : null;
          const messageType = message.type;
          const prevWhatsID = message.context ? message.context.id : null;

          logger.info(`mensaje recibido en crudo📄: ${JSON.stringify(message, null, 2)}`);

          const contacts = change.value.contacts;
          let profileName = senderPhoneNumber;

          if (contacts && contacts.length > 0) {
            profileName = contacts[0].profile.name;
            if (profileName) {
              log("El nombre es:", profileName);
            } else {
              log("El nombre no existe en el perfil.");
              profileName = senderPhoneNumber;
            }
          } else {
            log("No hay contactos en la entrada.");
            profileName = senderPhoneNumber;
          }

          log(`Nombre de perfil: ${profileName}`);

          // Se crea el email y password del usuario
          const email = `${senderPhoneNumber}_user@${AGENT_ID}.com`; // Agregar el nombre del agente
          const password = `${senderPhoneNumber}`;

          //* Registrar o obtener usuario en la base de datos esta funcion se encarga de crear el usuario en la base de datos y de obtenerlo si ya existe
          const user = await registerUser(senderPhoneNumber, profileName, email, password);

          console.log(user);

          //* Validacion de messageID para evitar procesar mensajes repetidos cuando se cicla el webhook
          let messageID = message.id;
          let resultMessageIDCheck = await checkMessageID(user.uid, messageID);

          if (resultMessageIDCheck !== null) {
            log(`El mensaje ${messageID} ya ha sido procesado`);
            return res.status(200).send("Peticion a gemini ya procesada");
          } else {
            let resultSaveMessageID = await createMessageIDRegister(user, messageID);
            log(`Resultado de guardar el id del mensaje: ${resultSaveMessageID}`);
          }

          try {
            // Procesamiento de los diferentes tipos de mensajes

            if (user !== null) {
              //- Escenario en el que exista el usuario
              if (prevWhatsID === null) {
                //! Procesar mensajes nuevos sin contexto anterior
                if (message.type === "text") {
                  //! Escenario donde el usuario envía un mensaje de texto
                  await sendTypingIndicatorToUser(user, message.id);

                  await handleTextMessage(message, senderPhoneNumber, user);

                } else if (message.type === "audio") {
                  //! Escenario donde el usuario envía un mensaje de audio
                  await sendTypingIndicatorToUser(user, message.id);

                  await handleAudioMessage(message, senderPhoneNumber, user);

                } else if (messageType === "image") {
                  //! Escenario donde el usuario envía un mensaje de tipo imagen

                  await sendTypingIndicatorToUser(user, message.id);

                  await handleImageMessage(message, senderPhoneNumber, user);

                } else {
                  //- Escenario de un formato no soportado
                  let sendMessage = `Disculpa, no puedo procesar este tipo de mensaje. Por favor, envía un tipo de mensaje valido.`;
                  await sendTextAgentMessage(sendMessage, user.phoneNumber, '', user.uid);
                }
              } else {
                //+ Procesar respuestas a mensajes previos
                if (message.type === "button") {
                  //+ Escenario donde presiona el usuario botones de reply de plantillas
                } else if (message.type === "interactive" && message.interactive.type === "nfm_reply") {
                  //+ Escenario donde usuario recibe resultados de flows

                  await handleNfmMessage(message, user);

                } else if (message.type === "interactive" && message.interactive.type === "button_reply") {
                  //+ Escenario donde presiona el usuario botones de reply de mensajes estándar

                  await handleButtonReplyMessage(user, message);

                } else if (message.type === "interactive" && message.interactive.type === "list_reply") {
                  //+ Escenario donde presiona opciones de un mensaje de menú con lista de opciones

                } else if (message.type === "location") {
                  //+ Escenario donde usuario envía ubicación como mensaje

                } else if (messageType === "image") {
                  //+ Escenario donde usuario envía imagen

                  await sendTypingIndicatorToUser(user, message.id);

                  await handleImageMessage(message, senderPhoneNumber, user);

                } else {
                  //- Manejo de mensaje estándar para escenarios no programados
                  let sendMessage = `Disculpa, no puedo procesar este tipo de mensaje. Por favor, envía un tipo de mensaje valido.`;
                  await sendTextAgentMessage(sendMessage, user.phoneNumber, '', user.uid);
                }
              }
            } else {
              //- Manejo de usuarios NO REGISTRADOS
              const contacts = change.value.contacts;
              let profileName = senderPhoneNumber;

              if (contacts && contacts.length > 0) {
                profileName = contacts[0].profile.name;
                if (profileName) {
                  log("El nombre es:", profileName);
                } else {
                  log("El nombre no existe en el perfil.");
                  profileName = senderPhoneNumber;
                }
              } else {
                log("No hay contactos en la entrada.");
                profileName = senderPhoneNumber;
              }

              log(`Nombre de perfil: ${profileName}`);

              if (message.type === "text") {
                //- Escenario donde el usuario envía un mensaje de texto
                await sendTypingIndicatorToUser(user, message.id);
                await handleTextMessage(message, senderPhoneNumber, user);
              } else if (message.type === "audio") {
                //- Escenario donde el usuario envía un mensaje de audio
                await sendTypingIndicatorToUser(user, message.id);
                await handleAudioMessage(message, senderPhoneNumber, user);
              } else if (message.type === "button") {
                //- Escenario donde presiona el usuario botones de reply de plantillas
                await handleButtonReplyMessage(user, message);
              } else if (
                message.type === "interactive" &&
                message.interactive.type === "button_reply"
              ) {
                //- Escenario donde presiona el usuario botones de reply de mensajes de texto
                // await processButtonMessage(message);
              } else {
                //- Enviar mensaje de creación de cuenta y política de privacidad. Esto es en caso de que no exista el usuario
                let sendMessage = `¡Hola! 👋\n\nTe damos la bienvenida a KAI Code.`;
                sendMessage = `${sendMessage}\n\nPara continuar, por favor, envía tu número de teléfono.`;
                await sendTextAgentMessage(sendMessage, senderPhoneNumber, '', user.uid);
              }
            }
          } catch (error) {
            let userUID = '';
            let phoneNumber = '';

            if (user.length !== 0) {
              userUID = user[0].uid;
              phoneNumber = user[0].phoneNumber;
            }

            let completeError = error.stack;

            if (error.response) {
              log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
              log(`Error response status: ${error.response.status}`);
              log(`Error response headers: ${JSON.stringify(error.response.headers, null, 2)}`);
              completeError = JSON.stringify(error.response.data, null, 2);
            } else if (error.request) {
              // Si no hubo respuesta, pero se envió una solicitud
              log(`No response received. Request details: ${JSON.stringify(error.request, null, 2)}`);
              completeError = JSON.stringify(error.request, null, 2);
            } else {
              // Si el error ocurrió antes de enviar la solicitud
              log(`Error setting up the request: ${error.message}`);
              completeError = error.stack;
            }

            log(`completeError: ${completeError}`);
          }
        }
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    logger.error("Error procesando el mensaje:", error.message);
    return res.sendStatus(500);
  }
});
/* eslint-enable */
