/**
 * Controller: Get Agents By User ID
 * Obtiene todos los agentes de un usuario
 */

import type { Request } from "firebase-functions/v2/https";
import type { Response } from "express";
import { db } from "../../config/firebase.config.js";
import { success, error, notFound } from "../../utils/http/response.js";

/**
 * Obtiene un los agentes de un usuario por ID desde /usersBuilders/userUID/agentDrafts
 */
export const getAgentsByUserId = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Obtener ID del body (ahora es POST)
    const { id: userId } = req.body;

    if (!userId) {
      return error(res, "User ID is required", 400);
    }

    //obtener la coleccion agentDrafts del usuario
    const agentDraftsRef = db
      .collection("usersBuilders")
      .doc(userId)
      .collection("agentDrafts");
    const agentDraftsSnapshot = await agentDraftsRef.get();

    if (agentDraftsSnapshot.empty) {
      return notFound(res, "Agent drafts not found");
    }

    //mapear los documentos a un array con todos sus campos
    const agents = agentDraftsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return success(res, agents);
  } catch (err) {
    console.error("Error getting agents by user ID:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return error(res, "Failed to get agent", 500, errorMessage);
  }
};
