/* eslint-disable */
/**
 * API: Get Collection By Agent ID
 * Obtiene todos los documentos de una colección específica de un agente
 * Incluye validación de seguridad para verificar que el agente pertenece al usuario
 * 
 * Parámetros:
 * - userId: ID del usuario (para validación de seguridad)
 * - agentId: ID del agente
 * - collectionName: Nombre de la colección (chats, knowledgeBase, modifications, etc.)
 * 
 * Retorna todos los documentos de la colección con sus campos completos
 */

const functions = require('firebase-functions');
const { db } = require('../../config/firebase.config');
const { success, error, notFound } = require('../../utils/response');

exports.getCollectionByAgentId = functions.https.onRequest(async (req, res) => {
    // Aplicar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        // Obtener parámetros del query
        let userId = req.query.userId;
        let agentId = req.query.agentId;
        let collectionName = req.query.collectionName;

        // Validar parámetros requeridos
        if (!userId) {
            return error(res, 'User ID is required', 400);
        }

        if (!agentId) {
            return error(res, 'Agent ID is required', 400);
        }

        if (!collectionName) {
            return error(res, 'Collection name is required', 400);
        }

        // Limpiar parámetros
        userId = userId.trim();
        agentId = agentId.trim();
        collectionName = collectionName.trim();

        console.log(`🔍 Validando acceso del usuario "${userId}" al agente "${agentId}"`);
        console.log(`📂 Colección solicitada: "${collectionName}"`);

        // MODO TEST: Permitir acceso sin validación si userId es "testid"
        if (userId === "testid") {
            console.log(`🧪 MODO TEST ACTIVADO: Saltando validación de seguridad`);
        } else {
            // VALIDACIÓN DE SEGURIDAD: Verificar que el agente pertenece al usuario
            const userAgentRef = db.collection('usersBuilders')
                .doc(userId)
                .collection('agentDrafts')
                .doc(agentId);

            const userAgentDoc = await userAgentRef.get();

            if (!userAgentDoc.exists) {
                console.log(`❌ ACCESO DENEGADO: El agente ${agentId} no pertenece al usuario ${userId}`);
                return error(res, 'Access denied: Agent does not belong to this user', 403);
            }

            console.log(`✅ Validación exitosa: El agente pertenece al usuario`);
        }

        // Verificar si el agente existe en agent_configurations
        const agentRef = db.collection('agent_configurations').doc(agentId);
        const agentDoc = await agentRef.get();

        if (!agentDoc.exists) {
            console.log(`❌ El agente ${agentId} no existe en agent_configurations`);
            return notFound(res, 'Agent');
        }

        console.log(`✅ Agente encontrado en agent_configurations`);

        // Obtener la colección específica del agente
        const collectionRef = agentRef.collection(collectionName);
        const collectionSnapshot = await collectionRef.get();

        console.log(`📊 Documentos encontrados en ${collectionName}: ${collectionSnapshot.docs.length}`);

        // Si la colección está vacía
        if (collectionSnapshot.empty) {
            console.log(`⚠️ La colección "${collectionName}" está vacía`);

            // Listar las colecciones disponibles para ayudar al usuario
            const availableCollections = await agentRef.listCollections();
            const collectionNames = availableCollections.map(col => col.id);

            return success(res, {
                userId,
                agentId,
                collectionName,
                documents: [],
                total: 0,
                message: `La colección "${collectionName}" no tiene documentos`,
                availableCollections: collectionNames
            });
        }

        // Mapear documentos a array con todos sus campos
        const documents = collectionSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Documentos obtenidos: ${documents.length}`);
        console.log(`📋 IDs de documentos:`, documents.map(d => d.id));

        // Retornar respuesta exitosa
        return success(res, {
            userId,
            agentId,
            collectionName,
            documents,
            total: documents.length,
            path: `agent_configurations/${agentId}/${collectionName}`
        });

    } catch (err) {
        console.error('Error getting collection by agent ID:', err);
        return error(res, 'Failed to get collection', 500, err.message);
    }
});

/* eslint-enable */
