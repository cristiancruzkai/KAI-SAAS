/* eslint-disable */
/**
 * API: Get Agent By ID
 * Obtiene un agente de agent_configurations con todos sus campos
 * y los nombres de todas sus subcolecciones dinámicamente
 */

const functions = require('firebase-functions');
const { db } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { success, error, notFound } = require('../../utils/response');

exports.getAgentById = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    try {
        // Obtener ID del query parameter
        const agentId = req.query.id;

        if (!agentId) {
            return error(res, 'Agent ID is required', 400);
        }

        // Obtener agente de la colección agent_configurations
        const agentRef = db.collection('agent_configurations').doc(agentId);
        const agentDoc = await agentRef.get();

        if (!agentDoc.exists) {
            return notFound(res, 'Agent');
        }

        // Obtener todos los campos del agente
        const agentData = agentDoc.data();

        // Obtener todas las subcolecciones del agente dinámicamente
        const collections = await agentRef.listCollections();
        const collectionNames = collections.map(col => col.id);

        // Retornar agente con sus campos y nombres de subcolecciones
        return success(res, {
            id: agentDoc.id,
            ...agentData,
            collections: collectionNames,
        });

    } catch (err) {
        console.error('Error getting agent:', err);
        return error(res, 'Failed to get agent', 500, err.message);
    }
});

/* eslint-enable */
