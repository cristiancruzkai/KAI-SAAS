/* eslint-disable */
/**
 * API: Get Agents By User ID
 * Obtiene todos los agentes de un usuario desde usersBuilders/{userId}/agentDrafts
 * Retorna cada agente con todos sus campos en formato JSON
 */

const functions = require('firebase-functions');
const { db } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { success, error } = require('../../utils/response');

exports.getAgentsByUserId = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    try {
        // Obtener userId del query parameter
        const userId = req.query.userId;

        if (!userId) {
            return error(res, 'User ID is required', 400);
        }

        // Obtener la subcolección agentDrafts del usuario
        const agentDraftsRef = db.collection('usersBuilders')
            .doc(userId)
            .collection('agentDrafts');

        const agentDraftsSnapshot = await agentDraftsRef.get();

        // Mapear documentos a array con todos sus campos
        const agents = agentDraftsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Retornar respuesta exitosa
        return success(res, {
            userId,
            agents,
            total: agents.length,
        });

    } catch (err) {
        console.error('Error getting agents by user ID:', err);
        return error(res, 'Failed to get agents', 500, err.message);
    }
});

/* eslint-enable */

