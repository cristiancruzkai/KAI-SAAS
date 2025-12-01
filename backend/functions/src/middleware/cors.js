/* eslint-disable */
/**
 * Middleware de CORS
 * Permite que el panel web haga requests a las Cloud Functions
 */

const corsMiddleware = (req, res, next) => {
    // Permitir requests desde cualquier origen (ajustar en producción)
    res.set('Access-Control-Allow-Origin', '*');

    // Métodos permitidos
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Headers permitidos
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (next) {
        next();
    }
};

module.exports = corsMiddleware;

/* eslint-enable */
