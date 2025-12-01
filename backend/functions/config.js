/* eslint-disable */
const admin = require('firebase-admin');
const db = admin.firestore();

const {
    CHIKASNAILS_AGENT_DOC_ID: KAI_AGENT_DOC_ID = "STexIpi2DKgQsT94fbbt",
    CHIKASNAILS_AGENT_ID: AGENT_ID = "chikasnails",
    MIX_TOKEN,
    WHATS_TOKEN_CHIKASNAILS: WHATSAPP_TOKEN_AGENT,
    PHONE_NUMBER_ID_CHIKASNAILS: PHONE_NUMBER_ID_AGENT,
    WHATS_TOKEN_V2: WHATSAPP_TOKEN_BUSINESS,
    PHONE_NUMBER_ID_BUSINESS_V2: PHONE_NUMBER_ID_BUSINESS,
    GEMINI_API_KEY: GEMINI_API_KEY,
} = process.env;

const firestorePaths = {
    agentDoc: () =>
        db.collection("kai_agents").doc(KAI_AGENT_DOC_ID),

    companyDoc: (companyId) =>
        db.collection("companies").doc(companyId),

    // Referencia a la coleccion de users
    usersCollection: () =>
        firestorePaths.agentDoc().collection("users"),

    // Referencia a la coleccion de chats
    chatsCollection: () =>
        firestorePaths.agentDoc().collection("chats"),

    // Referencia a la coleccion de los mensajes de un chat
    messagesCollection: (chatId) =>
        firestorePaths.chatDoc(chatId).collection("messages"),

    // Referencia a la coleccion de usersBusiness
    usersBusinessCollection: () =>
        db.collection("usersBusiness"),

    // Referencia a la coleccion de faq
    faqsCollection: () =>
        firestorePaths.agentDoc().collection("faqs"),

    // Referencia a la coleccion de eventos
    eventsCollection: () =>
        firestorePaths.agentDoc().collection("events"),

    // Referencia a la coleccion de ordenes
    ordersCollection: () =>
        firestorePaths.agentDoc().collection("orders"),

    // Referencia a la coleccion de google sheets
    sheetsCollection: () =>
        firestorePaths.agentDoc().collection("sheets"),

    // Referencias para configuración de pagos
    paymentConfigCollection: () =>
        firestorePaths.agentDoc().collection("payment_config"),

    // Referencia a la colleccion de appoinments
    appointmentsCollection: () =>
        firestorePaths.agentDoc().collection("appointments"),

    // Referencia a la colleccion de requests
    requestsCollection: () =>
        firestorePaths.agentDoc().collection("requests"),


    //--------------------------------------------------------------------
    //* Referencia a Documentos Individuales
    //--------------------------------------------------------------------

    // Referencia a la coleccion de memorias de usuario
    userMemoriesCollection: (uid) =>
        firestorePaths.userDoc(uid).collection("memories"),

    // Referencia a un documento de usuario business específico por su UID
    userBusinessDoc: (uid) =>
        firestorePaths.usersBusinessCollection().doc(uid),

    // Referencia a un DOCUMENTO de CHAT específico
    chatDoc: (chatId) =>
        firestorePaths.chatsCollection().doc(chatId),

    // Referencia a un DOCUMENTO de MENSAJE específico
    messageDoc: (chatId, messageId) =>
        firestorePaths.messagesCollection(chatId).doc(messageId),

    // Referencia a un documento de usuario específico por su UID
    userDoc: (uid) =>
        firestorePaths.usersCollection().doc(uid),

    // Referencia a un DOCUMENTO de ORDEN específico
    orderDoc: (orderId) =>
        firestorePaths.ordersCollection().doc(orderId),

    // Bucket de Storage
    storageBucket: () =>
        admin.storage().bucket(),

    storageFile: (filePath) =>
        firestorePaths.storageBucket().file(filePath),
};

module.exports = {
    KAI_AGENT_DOC_ID,
    MIX_TOKEN,
    WHATSAPP_TOKEN_AGENT,
    PHONE_NUMBER_ID_AGENT,
    AGENT_ID,
    WHATSAPP_TOKEN_BUSINESS,
    PHONE_NUMBER_ID_BUSINESS,
    GEMINI_API_KEY,
    firestorePaths,
}

/* eslint-enable */
