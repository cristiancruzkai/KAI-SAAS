/* eslint-disable */
/**
 * API: Get User Profile
 * Obtiene el perfil completo del usuario autenticado
 * Combina datos de Firebase Auth y Firestore
 */

const functions = require('firebase-functions');
const { db, auth } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { verifyAuth } = require('../../middleware/auth');
const { success, error } = require('../../utils/response');

exports.getUserProfile = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    // Verificar autenticación
    await verifyAuth(req, res, async () => {
        try {
            const uid = req.user.uid;

            // Obtener datos de Firebase Auth
            const authUser = await auth.getUser(uid);

            // Obtener datos adicionales de Firestore
            const userDoc = await db.collection('usersBuilders').doc(uid).get();

            let firestoreData = {};
            if (userDoc.exists) {
                firestoreData = userDoc.data();
            }

            // Combinar datos
            const userProfile = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                displayName: authUser.displayName || firestoreData.displayName || '',
                photoURL: authUser.photoURL || firestoreData.photoURL || '',
                createdAt: authUser.metadata.creationTime,
                lastSignIn: authUser.metadata.lastSignInTime,
                // Datos adicionales de Firestore
                ...firestoreData,
            };

            return success(res, userProfile);

        } catch (err) {
            console.error('Error getting user profile:', err);
            return error(res, 'Failed to get user profile', 500, err.message);
        }
    });
});

/* eslint-enable */
