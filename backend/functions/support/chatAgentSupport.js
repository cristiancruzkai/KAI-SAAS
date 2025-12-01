/* eslint-disable */
const axios = require('axios');
const admin = require("firebase-admin");
const uuid = require('uuid');
// const Mixpanel = require('mixpanel');
const { log, error } = require("firebase-functions/logger");

const { firestorePaths, MIX_TOKEN } = require('../config');

exports.getMessagesChat = async (actualUser) => {
  // const mixpanel = Mixpanel.init(MIX_TOKEN, { debug: true });
  const db = admin.firestore();
  const messages = [];

  try {
    let infoChat = await exports.getActiveChatByPhoneNumber(actualUser.phoneNumber);

    if (infoChat.length !== 0) {

      const snapshot = await firestorePaths.chatsCollection()
        .doc(infoChat[0].id)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      if (snapshot.empty) {
        log(`No se encontraron mensajes del usuario: ${actualUser.phoneNumber}`);
        return [];
      }

      for (const doc of snapshot.docs) {
        const message = doc.data();

        let parts = [];

        try {
          let safeText = JSON.stringify(message.content);

          if (message.mimeType === 'text') {
            parts.push({ text: safeText });
          } else if (message.mimeType === 'audio/mpeg') {
            parts.push({
              file_data: {
                file_uri: message.content,
                mime_type: message.mimeType,
              },
            });
          }

          if (parts.length > 0) {
            messages.push({
              role: message.role,
              parts,
            });
          }
        } catch (innerErr) {
          log(`Error al procesar mensaje para historial: ${innerErr.message}`);
        }
      }

      // Regresamos los mensajes ordenados de más antiguo a más reciente
      messages.reverse();

      return messages;

    } else {
      return [];
    }

  } catch (error) {
    const completeError = error?.stack || error?.message || 'Error desconocido';

    log(`Error al obtener mensajes: ${completeError}`);

    // mixpanel.track('error_log_doctor', {
    //   section: 'Error al obtener mensajes de usuario',
    //   companyID: '',
    //   userID: actualUser.uid || '',
    //   phoneNumber: actualUser.phoneNumber || '',
    //   function: 'getMessagesChat',
    //   error: completeError,
    // });

    return [];
  }
};

exports.createMessageChat2 = async (actualUser, role, content, mimeType, fromUser = false) => {
  try {
    const chatId = actualUser.uid;
    const messageId = uuid.v4();

    const messageInfo = {
      id: messageId,
      mimeType,
      content,
      createdBy: actualUser.uid,
      phoneNumber: actualUser.phoneNumber,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const chatRef = firestorePaths.chatDoc(chatId);
    const messageRef = firestorePaths.messageDoc(chatId, messageId);

    const chatSnapshot = await chatRef.get();

    if (!chatSnapshot.exists) {
      const chatData = {
        id: chatId,
        phoneNumber: actualUser.phoneNumber,
        createdBy: actualUser.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastMessage: messageId,
        lastMessageRole: role,
        lastMessageType: mimeType,
      };

      if (fromUser) {
        chatData.messageCount = admin.firestore.FieldValue.increment(1);
      } else {
        chatData.messageCount = 0;
      }

      await chatRef.set(chatData);
    } else {
      const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastMessage: messageId,
        lastMessageRole: role,
        lastMessageType: mimeType,
      };

      if (fromUser) {
        updateData.messageCount = admin.firestore.FieldValue.increment(1);
      }

      await chatRef.update(updateData);
    }

    await messageRef.set(messageInfo);

    log(`Chat and message stored successfully`);
    return 'Chat and message stored successfully';
  } catch (error) {
    log(`Error adding message in chat: ${error}`);
    return 'There was an error updating chat';
  }
};

exports.createMessageChat = async (userInfo, role, content, mimeType, fromUser = false, urlFile = '') => {
  // var mixpanel = Mixpanel.init(MIX_TOKEN, {
  //   debug: true,
  // });

  try {

    const messageId = uuid.v4();

    let messageInfo = {
      id: messageId,
      mimeType: mimeType,
      content: content,
      createdBy: userInfo.uid,
      phoneNumber: userInfo.phoneNumber,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (urlFile !== '' && urlFile !== null && urlFile !== undefined) {
      messageInfo.url = urlFile;
    }

    let infoChat = await exports.getActiveChatByPhoneNumber(userInfo.phoneNumber);

    if (infoChat.length !== 0) {

      const chatRef = firestorePaths.chatDoc(infoChat[0].id);

      // const chatRef = admin.firestore().collection('kai_agents')
      // .doc('AP5P1gJVjvTJGfU8F2aP').collection('chats').doc(infoChat[0].id);

      // await chatRef.update({updatedAt: admin.firestore.FieldValue.serverTimestamp(), lastMessage: messageInfo});

      const chatMessageRef = firestorePaths.messageDoc(infoChat[0].id, messageInfo.id);
      // const chatMessageRef = admin.firestore().collection('kai_agents')
      // .doc('AP5P1gJVjvTJGfU8F2aP').collection('chats').doc(infoChat[0].id).collection('messages').doc(messageInfo.id);

      await chatMessageRef.set(messageInfo);

    } else {

      // let id = uuid.v4();
      let id = userInfo.uid;

      let chatInfo = {
        id: id,
        createdBy: userInfo.uid,
        phoneNumber: userInfo.phoneNumber,
        lastMessage: messageInfo,
        status: 'Active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const chatRef = firestorePaths.chatDoc(chatInfo.id);
      // const chatRef = admin.firestore().collection('kai_agents')
      // .doc('AP5P1gJVjvTJGfU8F2aP').collection('chats').doc(chatInfo.id);

      await chatRef.set(chatInfo);

      const chatMessageRef = firestorePaths.messageDoc(chatInfo.id, messageInfo.id);
      // const chatMessageRef = admin.firestore().collection('kai_agents')
      // .doc('AP5P1gJVjvTJGfU8F2aP').collection('chats').doc(chatInfo.id).collection('messages').doc(messageInfo.id);

      await chatMessageRef.set(messageInfo);


      // mixpanel.track('new_conversation_pereyra', {
      //   agentID: "AP5P1gJVjvTJGfU8F2aP",
      //   companyID: "0wGzfA2xx2ArRE1wa2Kc",
      //   companyName: 'GRUPO PEREYRA',
      //   phoneNumber: userInfo.phoneNumber,
      //   userID: userInfo.uid,
      // });

    }

    log(`Chat update with success`);
    return 'Chat update with success';
  } catch (error) {
    log(`Error updating chat: ${error}`);
    return 'There was an error updating chat';
  }
}

//Función que busca algún chat activo del usuario
exports.getActiveChatByPhoneNumber = async (phoneNumber) => {
  // var mixpanel = Mixpanel.init(MIX_TOKEN, {
  //   debug: true,
  // });

  let chats = [];

  try {

    // const docRef = admin.firestore().collection('kai_agents')
    // .doc('AP5P1gJVjvTJGfU8F2aP').collection('chats')
    const docRef = firestorePaths.chatsCollection()
      .where('phoneNumber', '==', phoneNumber)
      .where('status', '==', 'Active');

    const querySnapshot = await docRef.get();

    if (querySnapshot.empty) {
      log(`No se encontraron chats con el teléfono: ${phoneNumber}`);
      return []; // Retorna vacío si no hay coincidencias.
    }

    chats.push(querySnapshot.docs[0].data());

    return chats;

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

    // mixpanel.track('error_log_pereyra', {
    //   section: 'Error realizando query de chat de agente pereyra por phoneNumber',
    //     companyID: '',
    //     userID: '',
    //     phoneNumber: phoneNumber,
    //     function: 'getActiveChatByPhoneNumber',
    //     error: `${completeError}`,
    // });

    return [];

  }

}

exports.obtainingStringActualDateStruct = async () => {
  try {
    //Se obtiene fecha de servidor actual
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Formatear la fecha y hora actual
    const [formattedDate, formattedTime] = formatter.formatToParts(now).reduce((acc, part) => {
      if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
        acc[0].push(part.value);
      } else if (part.type === 'hour' || part.type === 'minute' || part.type === 'second') {
        acc[1].push(part.value);
      }
      return acc;
    }, [[], []]);

    const nowInMexicoCity = new Date(
      Number(formattedDate[2]), // year
      Number(formattedDate[1]) - 1, // month (0-based)
      Number(formattedDate[0]), // day
      Number(formattedTime[0]), // hour
      //0, // minute
      //0 // second
      Number(formattedTime[1]), // minute
      Number(formattedTime[2]) // second
    );

    const day1 = String(nowInMexicoCity.getDate()).padStart(2, '0');
    const month1 = String(nowInMexicoCity.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0 (enero = 0)
    const year1 = nowInMexicoCity.getFullYear();

    // Extraer los componentes de la hora
    const hours1 = String(nowInMexicoCity.getHours()).padStart(2, '0');
    const minutes1 = String(nowInMexicoCity.getMinutes()).padStart(2, '0');

    // Formatear la fecha y hora como "dd/mm/yyyy hh:mm"
    const formattedDateTime1 = `${day1}/${month1}/${year1} ${hours1}:${minutes1}`;


    log(`actualString: ${formattedDateTime1}`);

    let dateStruct = {
      string: formattedDateTime1,
      date: nowInMexicoCity,
    };

    return dateStruct;

  } catch (error) {
    let completeError = error.stack;
    log(`Error obtaining actual date in string: ${completeError}`);
    return null;
  }
}

/* eslint-enable */
