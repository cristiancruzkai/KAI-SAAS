/**
 * Controller: Get Agent By ID
 * Obtiene un agente específico por su ID con todas sus subcolecciones
 */

import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { db } from '../../config/firebase.config.js';
import { success, error, notFound } from '../../utils/http/response.js';

/**
 * Obtiene un agente por ID desde agent_configurations
 */
export const getAgentById = async (req: Request, res: Response): Promise<any> => {
  try {
    // Obtener ID del body (ahora es POST)
    const { id: agentId } = req.body;

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
    const collectionNames = collections.map((col) => col.id);

    // Construir respuesta con tipo Agent
    const agent = {
      id: agentDoc.id,
      ...agentData,
      collections: collectionNames,
    };

    // Retornar agente con sus campos y nombres de subcolecciones
    return success(res, agent);
  } catch (err) {
    console.error('Error getting agent:', err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return error(res, 'Failed to get agent', 500, errorMessage);
  }
};
