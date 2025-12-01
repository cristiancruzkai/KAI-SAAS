/* eslint-disable */
const axios = require('axios');
const admin = require("firebase-admin");
const uuid = require('uuid');
// const Mixpanel = require('mixpanel');
const { log, error } = require("firebase-functions/logger");

// const { deleteAnnouncementById, deletePersonalMessageById } = require("../support/support");
// const { createMessageChat } = require("../support/chatAgentSupport");
const { sendTextAgentMessage } = require("../messages/messages")
const { MIX_TOKEN } = require("../config");


exports.handleButtonReplyMessage = async (user, message) => {
  const buttonId = message.interactive.button_reply.id;
  const params = new URLSearchParams(buttonId);
  const type = params.get("type");
  const phoneNumber = params.get("ownerPhoneNumber");

  log(`Botón presionado - Params: ${params}`);

  // const mixpanel = Mixpanel.init(MIX_TOKEN, {
  //   debug: true,
  // });

  try {
    //* Evento de inicio de procesamiento del botón

    switch (type) {

      // case "new_announcement":

      //   const announcementId = params.get("announcementId");
        
      //   const result = await deleteAnnouncementById(user.companyId, message.from, announcementId);
        
      //   if (!result.success) {
      //     log(`❌ Error eliminando anuncio: ${result.message}`);
      //     await sendTextAgentMessage(`❌ ${result.message}`, message.from, '', '');
      //   } else {
      //     log(`✅ Anuncio eliminado exitosamente`);
      //     const sendToChat = `El usuario ${user.name} ha eliminado el anuncio con id ${announcementId} y con el mensaje ${result.message}`;
      //     await createMessageChat(user, 'user', sendToChat, 'text', true);
      //   }
      //   break;

      default:
        console.log(`Botón con tipo desconocido: ${type}`);
        await sendTextAgentMessage('❌ Tipo de botón no reconocido.', message.from, '', '');
    }
  } catch (error) {
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
    
    // Enviar mensaje de error al usuario
    await sendTextAgentMessage('Lo sentimos, ocurrió un error inesperado al procesar tu solicitud.', message.from, '', '');
  }
}

/* eslint-enable */
