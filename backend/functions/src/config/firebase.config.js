/* eslint-disable */
/**
 * Configuración de Firebase Admin
 * Inicializa Firebase Admin SDK
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin (solo una vez)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
    admin,
    db,
    auth,
};

/* eslint-enable */
