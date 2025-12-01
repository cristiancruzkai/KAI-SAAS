/* eslint-disable */
const axios = require('axios');
const admin = require('firebase-admin');
const { generateMCPProcess } = require("../MCP/ProcessMCP");
const { WHATSAPP_TOKEN_AGENT, AGENT_ID } = require("../config");

exports.downloadURLAudioFromMeta = async (mediaID) => {
  const url = `https://graph.facebook.com/v22.0/${mediaID}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
      },
    });
    return response.data; // Contiene .url y .mime_type
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
    return null;
  }
}

exports.downloadAudioFromWhatsapp = async (audioURL, mediaID, mimeType = "audio/ogg") => {
  try {
    const response = await axios.get(audioURL, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
      },
      responseType: "arraybuffer",
    });

    const fileName = `${mediaID}.ogg`;
    const bucket = admin.storage().bucket();

    // Construir la ruta del archivo en Firebase Storage cambiar por el nombre de su agente
    const file = bucket.file(`kAI_Agentes/${AGENT_ID}/audios/${fileName}`);

    await file.save(response.data, {
      metadata: { contentType: mimeType },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/kAI_Agentes/${AGENT_ID}/audios/${fileName}`;
    return publicUrl;
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
    return null;
  }
}

exports.handleAudioMessage = async (message, from, actualUser) => {
  try {
    const audioId = message.audio?.id;
    const mimeType = message.audio?.mime_type || 'audio/ogg';

    if (!audioId) {
      console.warn(`Mensaje de audio sin ID recibido de ${from}`);
      return;
    }

    // Obtener URL temporal desde Meta
    const audioMeta = await exports.downloadURLAudioFromMeta(audioId);
    if (!audioMeta?.url) throw new Error("No se pudo obtener la URL del audio desde Meta");

    // Descargar y subir a Firebase Storage
    const audioURL = await exports.downloadAudioFromWhatsapp(audioMeta.url, audioId, mimeType);
    if (!audioURL) throw new Error("No se pudo subir el audio a Firebase Storage");

    // Enviar a MCP
    await generateMCPProcess(
      '', // prompt vacío por ser audio
      from,
      actualUser,
      from,
      'audio',
      audioURL,
      mimeType,
    );
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

  }
};

/* eslint-enable */
