/* eslint-disable */
/**
 * Utilidades para Respuestas HTTP
 * Estandariza las respuestas de las APIs
 */

/**
 * Respuesta exitosa
 */
const success = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Respuesta de error
 */
const error = (res, message, statusCode = 500, details = null) => {
    const response = {
        success: false,
        error: {
            message,
            code: statusCode,
        },
        timestamp: new Date().toISOString(),
    };

    if (details) {
        response.error.details = details;
    }

    return res.status(statusCode).json(response);
};

/**
 * Respuesta de validación fallida
 */
const validationError = (res, errors) => {
    return res.status(400).json({
        success: false,
        error: {
            message: 'Validation failed',
            code: 400,
            validationErrors: errors,
        },
        timestamp: new Date().toISOString(),
    });
};

/**
 * Respuesta de no encontrado
 */
const notFound = (res, resource = 'Resource') => {
    return error(res, `${resource} not found`, 404);
};

module.exports = {
    success,
    error,
    validationError,
    notFound,
};

/* eslint-enable */
