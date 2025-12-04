/* eslint-disable */
/**
 * API: Update User Profile
 * Actualiza datos del perfil del usuario (nombre, foto, etc.)
 * NO actualiza email ni password (usar APIs específicas)
 */

const functions = require('firebase-functions');
const { auth, db, admin } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { verifyAuth } = require('../../middleware/auth');
const { success, error } = require('../../utils/response');

exports.updateProfile = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    // Solo permitir PUT/PATCH
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
        return error(res, 'Method not allowed', 405);
    }

    // Verificar autenticación
    await verifyAuth(req, res, async () => {
        try {
            const uid = req.user.uid;
            const updateData = req.body;

            // Campos permitidos para actualizar
            const allowedFields = ['displayName', 'photoURL', 'phoneNumber'];
            const authUpdates = {};
            const firestoreUpdates = {};

            // Separar actualizaciones para Auth y Firestore
            Object.keys(updateData).forEach(key => {
                if (allowedFields.includes(key)) {
                    authUpdates[key] = updateData[key];
                }
                // Todos los campos van a Firestore
                firestoreUpdates[key] = updateData[key];
            });

            // Actualizar en Firebase Auth si hay cambios
            if (Object.keys(authUpdates).length > 0) {
                await auth.updateUser(uid, authUpdates);
            }

            // Actualizar en Firestore
            firestoreUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

            await db.collection('usersBuilders').doc(uid).set(
                firestoreUpdates,
                { merge: true } // Merge para no sobrescribir otros campos
            );

            // Obtener perfil actualizado
            const updatedUser = await auth.getUser(uid);
            const userDoc = await db.collection('usersBuilders').doc(uid).get();

            const updatedProfile = {
                uid: updatedUser.uid,
                email: updatedUser.email,
                displayName: updatedUser.displayName,
                photoURL: updatedUser.photoURL,
                phoneNumber: updatedUser.phoneNumber,
                ...userDoc.data(),
            };

            console.log(`✅ Profile updated for user: ${uid}`);

            return success(res, updatedProfile);

        } catch (err) {
            console.error('Error updating profile:', err);
            return error(res, 'Failed to update profile', 500, err.message);
        }
    });
});

/* eslint-enable */
