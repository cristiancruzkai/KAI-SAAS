/* eslint-disable */
/**
 * API: Update Email
 * Permite al usuario autenticado cambiar su email
 * (Preparado para cuando se necesite en el futuro)
 */

const functions = require('firebase-functions');
const { auth, db } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { verifyAuth } = require('../../middleware/auth');
const { success, error, validationError } = require('../../utils/response');

exports.updateEmail = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    // Solo permitir POST
    if (req.method !== 'POST') {
        return error(res, 'Method not allowed', 405);
    }

    // Verificar autenticación
    await verifyAuth(req, res, async () => {
        try {
            const uid = req.user.uid;
            const { newEmail } = req.body;

            // Validar nuevo email
            if (!newEmail) {
                return validationError(res, [
                    { field: 'newEmail', message: 'New email is required' }
                ]);
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                return validationError(res, [
                    { field: 'newEmail', message: 'Invalid email format' }
                ]);
            }

            // Actualizar email en Firebase Auth
            await auth.updateUser(uid, {
                email: newEmail,
                emailVerified: false, // Requerir verificación del nuevo email
            });

            // Actualizar email en Firestore si existe el documento
            const userDoc = await db.collection('usersBuilders').doc(uid).get();
            if (userDoc.exists) {
                await userDoc.ref.update({
                    email: newEmail,
                    emailVerified: false,
                    updatedAt: new Date().toISOString(),
                });
            }

            console.log(`✅ Email updated for user: ${uid} -> ${newEmail}`);

            return success(res, {
                message: 'Email updated successfully. Please verify your new email.',
                uid: uid,
                newEmail: newEmail,
                emailVerified: false,
            });

        } catch (err) {
            console.error('Error updating email:', err);

            if (err.code === 'auth/email-already-exists') {
                return error(res, 'Email already in use', 400);
            }

            return error(res, 'Failed to update email', 500, err.message);
        }
    });
});

/* eslint-enable */
