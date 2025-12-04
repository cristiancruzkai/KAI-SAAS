/* eslint-disable */
/**
 * Middleware de Autenticación
 * Verifica el token JWT de Firebase Auth en cada request
 */

const { auth } = require('../config/firebase.config');
const { error } = require('../utils/response');

/**
 * Middleware para verificar autenticación
 * Extrae y verifica el token JWT de Firebase Auth
 */
const verifyAuth = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'No authorization token provided', 401);
        }

        // Extraer el token
        const token = authHeader.split('Bearer ')[1];

        if (!token) {
            return error(res, 'Invalid authorization token', 401);
        }

        // Verificar el token con Firebase Auth
        const decodedToken = await auth.verifyIdToken(token);

        // Agregar información del usuario al request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            // Custom claims si existen
            ...decodedToken,
        };

        // Continuar al siguiente middleware/handler
        if (next) {
            next();
        }

    } catch (err) {
        console.error('Error verificando token:', err);

        if (err.code === 'auth/id-token-expired') {
            return error(res, 'Token expired', 401);
        }

        if (err.code === 'auth/argument-error') {
            return error(res, 'Invalid token format', 401);
        }

        return error(res, 'Authentication failed', 401, err.message);
    }
};

/**
 * Middleware opcional - solo verifica si hay token pero no falla si no hay
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await auth.verifyIdToken(token);

            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                emailVerified: decodedToken.email_verified,
                ...decodedToken,
            };
        }

        if (next) {
            next();
        }

    } catch (err) {
        // No hacer nada si falla, solo continuar sin usuario
        if (next) {
            next();
        }
    }
};

module.exports = {
    verifyAuth,
    optionalAuth,
};

/* eslint-enable */
