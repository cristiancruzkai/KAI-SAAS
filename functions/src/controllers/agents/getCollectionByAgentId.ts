/**
 * Controller: Get Collection By Document ID
 * Obtiene la informacion de una subcoleccion de un agente
 * se usara repetidamente para obtener las subcolecciones de un documento para un panel web iterable
 */
import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { db } from '../../config/firebase.config.js';
import { success, error, notFound } from '../../utils/http/response.js';

export const getCollectionByAgentId = async (req: Request, res: Response) => {
  try {
    // Obtener parámetros del body (ahora es POST)
    const { agentId, collection: collectionName } = req.body;

    if (!agentId) {
      return error(res, 'Agent ID is required', 400);
    }

    if (!collectionName) {
      return error(res, 'Collection name is required', 400);
    }

    // Obtener documento de la colección agent_configurations
    const agentRef = db.collection('agent_configurations').doc(agentId);
    const agentDoc = await agentRef.get();

    if (!agentDoc.exists) {
      return notFound(res, 'Agent');
    }

    // Obtener la subcoleccio de agente dinámicamente
    const collectionRef = agentRef.collection(collectionName);
    const collectionSnapshot = await collectionRef.get();

    if (collectionSnapshot.empty) {
      return notFound(res, 'Collection not found');
    }

    // Retornar documento con sus campos y nombres de subcolecciones
    return success(res, {
      id: agentDoc.id,
      ...collectionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  } catch (err) {
    console.error('Error getting document:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return error(res, 'Failed to get document', 500, errorMessage);
  }
};
