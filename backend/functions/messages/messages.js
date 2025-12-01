/* eslint-disable */
const axios = require("axios");
const { log, error } = require("firebase-functions/logger");
const admin = require("firebase-admin");
const uuid = require("uuid");
// const Mixpanel = require("mixpanel");
const { sendFlowMessageB2B } = require("./flowMessages");
const { PHONE_NUMBER_ID_AGENT, WHATSAPP_TOKEN_AGENT, MIX_TOKEN, firestorePaths } = require("../config");

exports.sendTextAgentMessage = async (bodyText, ownerPhoneNumber, companyID = "", ownerID = "") => {

  const url_whats = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  const messageData = {
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to: ownerPhoneNumber,
    type: "text",
    text: {
      body: bodyText,
    }
  };

  try {
    const response = await axios.post(url_whats, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        'Content-Type': 'application/json',
      }
    });

    log(`Message sent to ${ownerPhoneNumber}: ${JSON.stringify(response.data)}`);

  } catch (error) {
    log(`Error sending message: ${error}`);

    return `There was an error sending the text: ${error}`;
  }
};

exports.sendTextMessageToKaiTesting = async (bodyText, ownerPhoneNumber) => {
  // const mixpanel = Mixpanel.init(MIX_TOKEN, { debug: true });


  const url_whats = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  const messageData = {
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to: ownerPhoneNumber,
    type: "text",
    text: {
      body: bodyText,
    }
  };

  try {
    const response = await axios.post(url_whats, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        'Content-Type': 'application/json',
      }
    });

    log(`Message sent to ${ownerPhoneNumber}: ${JSON.stringify(response.data)}`);

    // mixpanel.track('agent_message_send', {
    //   phoneNumber: ownerPhoneNumber,
    //   userID: ownerID,
    //   companyID,
    //   flow: 'LIFE-SUPPORT',
    //   messageID: message_id,
    // });

    // mixpanel.track('endSendWhatsapp_Agent_LS', {});
    return 'Text sent with success';

  } catch (error) {
    log(`Error sending message: ${error}`);

    // mixpanel.track('error_log_Agent_LS', {
    //   section: 'Error enviando mensaje de texto',
    //   companyID,
    //   userID: ownerID,
    //   function: 'sendTextMessageB2C',
    //   error: `${error}`,
    // });
    // mixpanel.track('endSendWhatsapp_Agent_LS', {});

    return `There was an error sending the text: ${error}`;
  }
};

exports.sendWellcomeMessage = async (phoneNumber) => {

  let url_whats = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  let textBody = `*👋 ¡Hola! Bienvenido a Life Support* \n\nSoy tu asistente virtual especializado en traslados médicos\n\nPresiona el botón para iniciar ⬇️\n🔗 talktokai.com/privacidad`;

  let messageData = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: textBody,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: `?type=wellcome&ownerPhoneNumber=${phoneNumber}`,
              title: "Continuar",
            },
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(url_whats, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        "Content-Type": "application/json",
      },
    });

    log(`Mensaje enviado a ${phoneNumber}:`, response.data);
    return "Mensaje enviado con éxito";
  } catch (error) {
    error(
      `Error al enviar mensaje a ${phoneNumber}:`,
      error.response ? error.response.data : error
    );
    return `Error al enviar mensaje: ${error}`;
  }
};

exports.sendPdfDocumentMessage = async (documentUrl, documentName, caption = "", ownerPhoneNumber) => {

  let url_whats = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  const messageData = {
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to: ownerPhoneNumber,
    type: "document",
    document: {
      // id: "<MEDIA_ID>", <!-- Only if using uploaded media -->
      link: documentUrl,
      filename: documentName,
      caption: caption
    }
  };

  try {
    const response = await axios.post(url_whats, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        'Content-Type': 'application/json',
      }
    });

    log(`Documento enviado con éxito`);
    return `Documento enviado con éxito ${response.data}`;

  } catch (error) {
    let completeError = error.stack;
    if (error.response) {
      log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
      log(`Error response status: ${error.response.status}`);
      completeError = JSON.stringify(error.response.data, null, 2);
    } else if (error.request) {
      log(`No response received: ${JSON.stringify(error.request, null, 2)}`);
      completeError = JSON.stringify(error.request, null, 2);
    } else {
      log(`Setup error: ${error.message}`);
    }

    log(`Error enviando documento: ${completeError}`);
    return `Error enviando documento: ${completeError}`;
  }
}

exports.sendImageMessage = async (imageUrl, ownerPhoneNumber) => {

  let url_whats = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  const messageData = {
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to: ownerPhoneNumber,
    type: "image",
    image: {
      // id: "<MEDIA_ID>", <!-- Only if using uploaded media -->
      link: imageUrl,
      // caption: "<MEDIA_CAPTION_TEXT>"
    }
  };

  try {
    const response = await axios.post(url_whats, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        'Content-Type': 'application/json',
      }
    });

    log(`Imagen del programa enviada con éxito`);
    return `Imagen enviada con éxito ${response.data}`;

  } catch (error) {
    let completeError = error.stack;
    if (error.response) {
      log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
      log(`Error response status: ${error.response.status}`);
      completeError = JSON.stringify(error.response.data, null, 2);
    } else if (error.request) {
      log(`No response received: ${JSON.stringify(error.request, null, 2)}`);
      completeError = JSON.stringify(error.request, null, 2);
    } else {
      log(`Setup error: ${error.message}`);
    }

    log(`Error enviando imagen: ${completeError}`);
    return `Error enviando imagen: ${completeError}`;
  }
}

exports.sendVideoMessage = async (videoUrl, videoName, caption = "", ownerPhoneNumber) => {

  let url_whats = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  const messageData = {
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to: ownerPhoneNumber,
    type: "video",
    video: {
      // id: "<MEDIA_ID>", <!-- Only if using uploaded media -->
      link: videoUrl,
      caption: videoName
    }
  };

  try {
    const response = await axios.post(url_whats, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        'Content-Type': 'application/json',
      }
    });

    log(`Documento enviado con éxito`);
    return `Documento enviado con éxito ${response.data}`;

  } catch (error) {
    let completeError = error.stack;
    if (error.response) {
      log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
      log(`Error response status: ${error.response.status}`);
      completeError = JSON.stringify(error.response.data, null, 2);
    } else if (error.request) {
      log(`No response received: ${JSON.stringify(error.request, null, 2)}`);
      completeError = JSON.stringify(error.request, null, 2);
    } else {
      log(`Setup error: ${error.message}`);
    }

    log(`Error enviando documento: ${completeError}`);
    return `Error enviando documento: ${completeError}`;
  }
}

exports.sendFlowsToBusinessUsers = async (clientPhoneNumber, clientName, flowData, flowParams, formattedText) => {
  const agentDoc = (await firestorePaths.agentDoc().get()).data();
  const generalAdvisorsIds = agentDoc?.general_advisors_ids || [];

  if (generalAdvisorsIds.length < 1) {
    console.error('No hay asesores generales configurados para notificar.');
    return { success: false, message: "No hay asesores generales configurados para notificar." };
  }

  const results = await Promise.all(generalAdvisorsIds.map(async (advisorId) => {
    const advisorDoc = await firestorePaths.userBusinessDoc(advisorId).get();
    const advisorData = advisorDoc.data();

    if (!advisorData || !advisorData.phoneNumber) {
      console.error(`No se encontró el número de teléfono para el asesor con ID: ${advisorId}`);
      return false;
    }

    try {
      await sendFlowMessageB2B(
        advisorData.phoneNumber,
        `+${clientPhoneNumber.replace("1", "")}`,
        clientName,
        flowData,
        flowParams,
        formattedText,
      );
    } catch (err) {
      console.error(`Error al notificar al asesor con ID: ${advisorId}`, err);
      return false;
    }
    return true;
  }));

  const total = generalAdvisorsIds.length;
  const { failed, successful } = results.reduce((acc, result) => {
    if (result) {
      acc.successful += 1;
    } else {
      acc.failed += 1;
    }
    return acc;
  }, { failed: 0, successful: 0 });

  if (failed > 0) {
    console.error('Error al notificar a uno o más asesores.');
    return {
      success: false,
      message: failed === total ?
        "Error al notificar a todos los asesores." :
        "Error al notificar a uno o más asesores.",
      count: { total, failed, successful }
    };
  }

  return {
    success: true,
    message: "Notificación enviada a todos los asesores.",
    count: { total, successful, failed }
  };
}



/* eslint-enable */
