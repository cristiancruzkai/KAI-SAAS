import { success, error, notFound, validationError } from "../utils/http/response";

export const getAgentById = async (req, res) => {
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
};

export const getAgentsByUserId = async (req, res) => {
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
};

export const getCollectionByAgentId = async (req, res) => {
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
};

export const updateAgent = async (req, res) => {
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
};
