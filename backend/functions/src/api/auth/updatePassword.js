/* eslint-disable */
/**
 * API: Update Password
 * Permite al usuario autenticado cambiar su contraseña
 */

const functions = require('firebase-functions');
const { auth } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { verifyAuth } = require('../../middleware/auth');
const { success, error, validationError } = require('../../utils/response');

exports.updatePassword = functions.https.onRequest(async (req, res) => {
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
            const { newPassword } = req.body;

            // Validar nueva contraseña
            if (!newPassword) {
                return validationError(res, [
                    { field: 'newPassword', message: 'New password is required' }
                ]);
            }

            if (newPassword.length < 6) {
                return validationError(res, [
                    { field: 'newPassword', message: 'Password must be at least 6 characters' }
                ]);
            }

            // Actualizar contraseña en Firebase Auth
            await auth.updateUser(uid, {
                password: newPassword,
            });

            console.log(`✅ Password updated for user: ${uid}`);

            return success(res, {
                message: 'Password updated successfully',
                uid: uid,
            });

        } catch (err) {
            console.error('Error updating password:', err);
            return error(res, 'Failed to update password', 500, err.message);
        }
    });
});

/* eslint-enable */
