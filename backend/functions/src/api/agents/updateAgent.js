/* eslint-disable */
/**
 * API: Update Agent
 * Actualiza un agente existente
 */

const functions = require('firebase-functions');
const { db, admin } = require('../../config/firebase.config');
const corsMiddleware = require('../../middleware/cors');
const { success, error, notFound } = require('../../utils/response');

exports.updateAgent = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    corsMiddleware(req, res);

    // Solo permitir PUT
    if (req.method !== 'PUT') {
        return error(res, 'Method not allowed', 405);
    }

    try {
        const agentId = req.query.id;
        const updateData = req.body;

        if (!agentId) {
            return error(res, 'Agent ID is required', 400);
        }

        // Verificar que el agente existe
        const agentRef = db.collection('kai_agents').doc(agentId);
        const agentDoc = await agentRef.get();

        if (!agentDoc.exists) {
            return notFound(res, 'Agent');
        }

        // Actualizar agente
        const updatedData = {
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await agentRef.update(updatedData);

        // Obtener agente actualizado
        const updatedAgent = await agentRef.get();

        return success(res, {
            id: agentId,
            ...updatedAgent.data(),
        });

    } catch (err) {
        console.error('Error updating agent:', err);
        return error(res, 'Failed to update agent', 500, err.message);
    }
});

/* eslint-enable */
