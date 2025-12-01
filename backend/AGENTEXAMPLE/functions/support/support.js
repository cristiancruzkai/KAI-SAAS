/* eslint-disable */
const admin = require("firebase-admin");
const uuid = require("uuid");
const axios = require("axios");
const db = admin.firestore();
const { log, error } = require("firebase-functions/logger");
const { logger } = require("firebase-functions/logger");
// const Mixpanel = require("mixpanel");

const { createMessageChat, obtainingStringActualDateStruct } = require("./chatAgentSupport");
const { sendTextAgentMessage } = require("../messages/messages");

const {
  firestorePaths,
  KAI_AGENT_DOC_ID,
  PHONE_NUMBER_ID_AGENT,
  WHATSAPP_TOKEN_AGENT
} = require("../config");


exports.getUserByPhoneNumber = async (phoneNumber) => {
  try {
    querySnapshotReference = firestorePaths.usersCollection();

    const querySnapshot = await querySnapshotReference
      .where("phoneNumber", "==", phoneNumber)
      .get();

    if (querySnapshot.empty) {
      log(`No se encontraron usuarios con el teléfono: ${phoneNumber}`);
      return null;
    }

    const userDoc = querySnapshot.docs[0];

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    const completeError = error?.stack || error?.message || "Error desconocido";

    log(`❌ Error en getUserByPhoneNumber: ${completeError}`);

    return null;
  }
};

// Envio de typing indicator a la persona que envió el mensaje esto es el "escribiendo..."
exports.sendTypingIndicatorToUser = async (userInfo, messageID) => {
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

  const messageData = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageID,
    typing_indicator: {
      type: "text", // Tipo de indicador: puede variar si se liberan más tipos en el futuro
    },
  };

  try {
    const response = await axios.post(url, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        "Content-Type": "application/json",
      },
    });

    // console.log(
    //   `✅ Typing indicator enviado a ${userInfo.phoneNumber}. Respuesta:`,
    //   JSON.stringify(response.data, null, 2)
    // );

    return true;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("❌ Error al enviar typing indicator:", errData);
    return false;
  }
};

exports.registerUser = async (phoneNumber, profileName, email, password) => {
  try {
    let userRecord;

    //! Verificar si el usuario existe en Auth
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log("Usuario ya existe en Auth:", userRecord.uid);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        userRecord = await admin.auth().createUser({ email, password });
        console.log("Usuario creado en Auth:", userRecord.uid);
      } else {
        throw err;
      }
    }

    const uid = userRecord.uid;

    //! Buscar si el usuario existe en BD por el uid obtenido de Auth
    const userDocRef = firestorePaths.userDoc(uid);
    const docSnap = await userDocRef.get();

    //* Si el documento ya existe, lo devuelve
    if (docSnap.exists) {
      console.log(
        `Documento de usuario encontrado en Firestore con UID: ${uid}`
      );
      return docSnap.data();
    }

    //! Si el usuario no existe en BD lo crea y devuelve el documento del user
    else {

      let dateUpdate = await obtainingStringActualDateStruct();

      console.log(
        `Documento no encontrado en Firestore. Creando uno nuevo para el UID: ${uid}`
      );

      // Construir el documento del usuario algunos datos no son usados pero se tiene de control
      const newUserDoc = {
        uid,
        accessRole: 'regular',
        companyID: '',
        companyRole: 'Miembro',
        createdBy: uid,
        email: email,
        folio: '1',
        name: profileName,
        password: password,
        permit: 1,
        phoneNumber: phoneNumber,
        photoURL: '',
        receivedNotifications: true,
        role: 'regular',
        status: 'Aprobado',
        status_lead: 'prospect',
        uid: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(dateUpdate.date.getTime() + 6 * 60 * 60 * 1000)),
        updateDateString: dateUpdate.string,
      };

      await userDocRef.set(newUserDoc);

      //* Crear el chat con el mensaje de que el usuario fue registrado
      await createMessageChat(
        newUserDoc,
        "user",
        "El usuario envio el primer mensaje y se registró correctamente",
        "text"
      );

      //* Despues de crear el documento lo devuelve
      return newUserDoc;
    }
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
    log(`🧩 completeError: ${completeError}`);
    return null;
  }
};

// * Funciones para validar mensajes

//Función que valida si ya existe el id del mensaje enviado del usuario
exports.checkMessageID = async (userUID, messageID) => {
  try {
    const tasksSnapshot = await firestorePaths
      .userDoc(userUID)
      .collection("messagesID")
      .where("id", "==", messageID)
      .limit(1)
      .get();

    // Verificamos si hay documentos
    if (!tasksSnapshot.empty) {
      const taskData = tasksSnapshot.docs[0].data();

      return taskData;
    } else {
      // Si no hay tareas, devolvemos null
      return null;
    }
  } catch (error) {
    let completeError = error.stack;

    if (error.response) {
      log(
        `Error response data: ${JSON.stringify(error.response.data, null, 2)}`
      );
      log(`Error response status: ${error.response.status}`);
      log(
        `Error response headers: ${JSON.stringify(
          error.response.headers,
          null,
          2
        )}`
      );
      completeError = JSON.stringify(error.response.data, null, 2);
    } else if (error.request) {
      // Si no hubo respuesta, pero se envió una solicitud
      log(
        `No response received. Request details: ${JSON.stringify(
          error.request,
          null,
          2
        )}`
      );
      completeError = JSON.stringify(error.request, null, 2);
    } else {
      // Si el error ocurrió antes de enviar la solicitud
      log(`Error setting up the request: ${error.message}`);
      completeError = error.stack;
    }

    log(`Error al buscar id mensaje ${messageID}: ${completeError}`);
    return null;
  }
};

//Función que guarda id de mensaje que manda usuario
exports.createMessageIDRegister = async (actualUser, messageID) => {
  try {
    let messageIDInfo = {
      id: messageID,
      createdBy: actualUser.uid,
      createdByPhoneNumber: actualUser.phoneNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = firestorePaths
      .userDoc(actualUser.uid)
      .collection("messagesID")
      .doc(messageIDInfo.id);

    await docRef.set(messageIDInfo);

    return `Creación de registro de id mensaje exitosa`;
  } catch (error) {
    let completeError = error.stack;

    if (error.response) {
      log(
        `Error response data: ${JSON.stringify(error.response.data, null, 2)}`
      );
      log(`Error response status: ${error.response.status}`);
      log(
        `Error response headers: ${JSON.stringify(
          error.response.headers,
          null,
          2
        )}`
      );
      completeError = JSON.stringify(error.response.data, null, 2);
    } else if (error.request) {
      // Si no hubo respuesta, pero se envió una solicitud
      log(
        `No response received. Request details: ${JSON.stringify(
          error.request,
          null,
          2
        )}`
      );
      completeError = JSON.stringify(error.request, null, 2);
    } else {
      // Si el error ocurrió antes de enviar la solicitud
      log(`Error setting up the request: ${error.message}`);
      completeError = error.stack;
    }

    log(`Error al crear tarea recurrente de ${actualUser.name}`);
    // mixpanel.track('error_log_b2c', {
    //   section: 'Error al crear registro de mensaje de id de usuario',
    //   companyID: '',
    //   userID: actualUser.uid,
    //   function: 'createMessageIDRegister',
    //   error: `${completeError}`,
    // });

    return `Ocurrió un error registrando messageID ${messageID}`;
  }
};

//Función para obtener datos de agente
exports.getInfoAgent = async () => {
  try {

    const docRef = await admin.firestore().collection('kai_agents').doc(KAI_AGENT_DOC_ID).get();

    if (docRef.exists) {
      let responseInfo = { status: 200, outPut: docRef.data() };
      return responseInfo;
    } else {
      log(`No info available in agent doc`);
      let responseInfo = { status: 400, outPut: {} };
      return responseInfo;
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

    let responseInfo = { status: 400, outPut: completeError };
    return responseInfo;

  }

}

//Función para obtener usuario B2B por UID
exports.getUserB2BByUID = async (userUID, userInfo) => {
  try {

    const doc = await admin.firestore().collection('usersBusiness')
      .doc(userUID).get();
    // const doc = await admin.firestore().collection('kai_agents')
    //   .doc('AP5P1gJVjvTJGfU8F2aP').collection('users').doc(userUID).get();

    if (doc.exists) {
      return doc.data();
    } else {
      log(`No user registerd with uid: ${userUID}`);
      return null;
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

    // mixpanel.track('error_log', {
    //   section: 'Error realizando query de usuario por UID',
    //     companyID: '',
    //     userID: userInfo.uid,
    //     phoneNumber: userInfo.phoneNumber,
    //     function: 'getUserB2BByUID',
    //     error: `${completeError}`,
    // });


    return null;

  }

}

exports.getUserMemory = async (actualUser) => {
  try {
    const snapshot = await firestorePaths
      .userMemoriesCollection(actualUser.uid)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    if (!snapshot.empty) {
      const data = snapshot.docs.map(doc => {
        const content = doc.data().content || "No content provided";
        return { id: doc.id, content };
      });

      return {
        success: true,
        message: "User memory retrieved successfully.",
        result: data,
      };
    } else {
      console.error(`No user memory found for UID: ${actualUser.uid}`);

      return {
        success: false,
        message: "No user memory found.",
        result: [],
      };
    }

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
    log(`🧩 completeError: ${completeError}`);

    return {
      success: false,
      message: `Error retrieving user memory: ${completeError}`,
      result: [],
    }
  }
}

exports.getIfUserIsVerified = async (actualUser) => {
  try {
    if (!actualUser || !actualUser.uid) return false;

    const userDocRef = firestorePaths.userDoc(actualUser.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) return false;

    const userData = userDoc.data();
    const lastValidatedAt = userData.licenseValidatedAt || null;

    if (!lastValidatedAt) return false;

    let validatedDate;
    if (lastValidatedAt && typeof lastValidatedAt.toDate === "function") {
      validatedDate = lastValidatedAt.toDate();
    } else {
      validatedDate = new Date(lastValidatedAt);
    }

    if (isNaN(validatedDate.getTime())) return false;

    const diffInMs = Date.now() - validatedDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours <= 24;
  } catch (err) {
    console.log(`Error in getIfUserIsVerified: ${err?.stack || err?.message || err}`);

    return false;
  }
}

/* eslint-enable */
