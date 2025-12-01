/* eslint-disable */
const axios = require("axios");
const admin = require("firebase-admin");
const { log, error } = require("firebase-functions/logger");
// const { generatePromptFromImage } = require("../services/requestModel");
// const { sendTextMessageLS } = require("../messages/messages");
const { generateMCPProcess } = require("../MCP/ProcessMCP");
const { WHATSAPP_TOKEN_AGENT, AGENT_ID } = require("../config");

exports.downloadURLImageFromMeta = async (mediaID) => {
  const url = `https://graph.facebook.com/v22.0/${mediaID}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
      },
    });

    // La API de Meta devuelve un objeto con la URL, tipo MIME, etc. Queremos la URL.
    if (!response.data.url) {
      error(`No se encontró URL en la respuesta de Meta:`, response.data);
      return null;
    }

    return response.data.url;
  } catch (error) {
    error(`Error obteniendo URL de imagen desde Meta para mediaID ${mediaID}:`, error.message);
    if (error.response) {
      error(`Status: ${error.response.status}, Data:`, JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
};

exports.downloadImageFromWhatsapp = async (imageURL, mediaID, mime_type) => {
  const bucket = admin.storage().bucket();
  try {
    const response = await axios.get(imageURL, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`, // Revisa si este token es realmente necesario aquí.
      },
      responseType: 'arraybuffer', // Esencial para manejar archivos binarios
      responseEncoding: "binary"   // Asegura el encoding binario
    });

    // Extraer la extensión del archivo del tipo MIME
    const fileExtension = mime_type.split('/')[1] || 'jpeg'; // Ejemplo: 'image/jpeg' -> 'jpeg'
    const fileName = `${mediaID}.${fileExtension}`;

    // Ruta donde se guardará la imagen en Storage
    const file = bucket.file(`kAI_Agentes/${AGENT_ID}/images/${fileName}`);

    // Subir el buffer de la imagen a Firebase Storage
    await file.save(response.data, {
      metadata: {
        contentType: mime_type, // Usamos el tipo MIME proporcionado
      },
    });

    // Hacer público el archivo y obtener su URL
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/kAI_Agentes/${AGENT_ID}/images/${fileName}`;

    return publicUrl;

  } catch (error) {
    error(`Error descargando o subiendo imagen desde WhatsApp para mediaID ${mediaID}:`, error.message);
    if (error.response) {
      error(`Status: ${error.response.status}, Data:`, JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
};

exports.handleImageMessage = async (message, from, actualUser) => {
  try {
    const imageId = message.image?.id;
    const mimeType = message.image?.mime_type || 'image/jpeg';

    if (!imageId) {
      log(`Mensaje de imagen sin ID recibido de ${from}`);
      return;
    }

    const imageURL = await exports.downloadURLImageFromMeta(imageId);
    if (!imageURL) {
      throw new Error("No se pudo obtener la URL de la imagen desde Meta");
    }

    const firebaseURL = await exports.downloadImageFromWhatsapp(imageURL, imageId, mimeType);
    if (!firebaseURL) {
      throw new Error("No se pudo subir la imagen a Firebase Storage");
    }

    const messageText = `El usuario envió una imagen que ha sido recibida y se guardó exitosamente. Puedes acceder a ella en esta URL: ${firebaseURL}. Por favor, procede a completar la solicitud relacionada con esta imagen.`;

    await generateMCPProcess(
      messageText,
      from,
      actualUser,
      from,
      'image',
      firebaseURL,
      mimeType,
    );

  } catch (error) {
    let completeError = error.stack;

    if (error.response) {
      error(`Error de respuesta en handleImageMessage: Status ${error.response.status}, Data: ${JSON.stringify(error.response.data, null, 2)}`);
      completeError = JSON.stringify(error.response.data, null, 2);
    } else if (error.request) {
      error(`No se recibió respuesta en handleImageMessage. Request details: ${JSON.stringify(error.request, null, 2)}`);
      completeError = JSON.stringify(error.request, null, 2);
    } else {
      error(`Error en la configuración de la petición en handleImageMessage: ${error.message}`);
      completeError = error.stack;
    }

    error(`Error completo en handleImageMessage: ${completeError}`);
  }
};

/* eslint-enable */

