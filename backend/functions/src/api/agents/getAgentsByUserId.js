/* eslint-disable */
/**
 * API: Get Agents By User ID
 * Obtiene todos los agentes de un usuario desde usersBuilders/{userId}/agentDrafts
 * Retorna cada agente con todos sus campos en formato JSON
 */

const functions = require('firebase-functions');
const { db } = require('../../config/firebase.config');
const { success, error } = require('../../utils/response');

exports.getAgentsByUserId = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        // Obtener userId del query parameter
        const userId = req.query.userId;

        if (!userId) {
            return error(res, 'User ID is required', 400);
        }

        console.log(`🔍 Buscando agentes para userId: ${userId}`);

        // Verificar si el documento del usuario existe
        const userDocRef = db.collection('usersBuilders').doc(userId);
        const userDoc = await userDocRef.get();

        console.log(`📄 Usuario existe: ${userDoc.exists}`);

        // Obtener la subcolección agentDrafts del usuario
        const agentDraftsRef = db.collection('usersBuilders')
            .doc(userId)
            .collection('agentDrafts');

        const agentDraftsSnapshot = await agentDraftsRef.get();

        console.log(`📊 Documentos encontrados en agentDrafts: ${agentDraftsSnapshot.docs.length}`);
        console.log(`🔍 Ruta consultada: usersBuilders/${userId}/agentDrafts`);

        // Si no hay documentos, intentar verificar otras posibles rutas
        if (agentDraftsSnapshot.empty) {
            console.log('⚠️ No se encontraron agentes en agentDrafts, verificando otras colecciones...');

            // Listar todas las subcolecciones del usuario
            const collections = await userDocRef.listCollections();
            console.log('📁 Subcolecciones disponibles:', collections.map(col => col.id));
        }

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

