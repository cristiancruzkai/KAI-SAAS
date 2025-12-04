/* eslint-disable */
/**
 * API: Login
 * Autentica un usuario con email y password
 * Retorna un JWT token de Firebase Auth
 */

const functions = require('firebase-functions');
const { auth } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { success, error, validationError } = require('../../utils/response');

exports.login = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    // Solo permitir POST
    if (req.method !== 'POST') {
        return error(res, 'Method not allowed', 405);
    }

    try {
        const { email, password } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return validationError(res, [
                { field: 'email', message: 'Email is required' },
                { field: 'password', message: 'Password is required' }
            ]);
        }

        // Verificar que el usuario existe
        let user;
        try {
            user = await auth.getUserByEmail(email);
        } catch (err) {
            console.log('User not found:', email);
            return error(res, 'Invalid email or password', 401);
        }

        // IMPORTANTE: Usar WEB_API_KEY (no FIREBASE_API_KEY porque es prefijo reservado)
        const apiKey = process.env.WEB_API_KEY || functions.config().auth?.apikey;

        if (!apiKey) {
            console.error('WEB_API_KEY not configured');
            console.error('Configure with: firebase functions:config:set auth.apikey="YOUR_API_KEY"');
            return error(res, 'Server configuration error', 500);
        }

        // Verificar credenciales usando Firebase Auth REST API
        const verifyPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

        const verifyResponse = await fetch(verifyPasswordUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true,
            }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
            console.log('Invalid credentials for:', email);
            console.log('Firebase Auth error:', verifyData.error);
            return error(res, 'Invalid email or password', 401);
        }

        // Credenciales válidas - retornar el ID token
        const idToken = verifyData.idToken;
        const refreshToken = verifyData.refreshToken;

        console.log(`✅ Login successful for user: ${email}`);

        return success(res, {
            message: 'Login successful',
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                emailVerified: user.emailVerified,
            },
            token: idToken,
            refreshToken: refreshToken,
            expiresIn: verifyData.expiresIn || '3600', // segundos
        });

    } catch (err) {
        console.error('Error in login:', err);
        return error(res, 'Login failed', 500, err.message);
    }
});

/* eslint-enable */
