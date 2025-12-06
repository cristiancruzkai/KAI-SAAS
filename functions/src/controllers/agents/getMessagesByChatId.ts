/**
 * Controller: Get Messages By Chat ID
 * Obtiene todos los mensajes de un chat dentro de un agente con paginación
 */

import type { Request } from "firebase-functions/v2/https";
import type { Response } from "express";
import { db } from "../../config/firebase.config.js";
import { success, error, notFound } from "../../utils/http/response.js";

export const getMessagesByChatId = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Obtener parámetros del body
    const {
      chatId,
      agentId,
      limit = 50, // Límite de mensajes por página (default: 50)
      offset = 0, // Offset para paginación (default: 0)
    } = req.body;

    if (!chatId) {
      return error(res, "Chat ID is required", 400);
    }

    if (!agentId) {
      return error(res, "Agent ID is required", 400);
    }

    // Validar limit y offset
    const pageLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100); // Entre 1 y 100
    const pageOffset = Math.max(parseInt(offset) || 0, 0); // Mínimo 0

    // Obtener la colección de chats del agente
    const agentRef = db
      .collection("agent_configurations")
      .doc(agentId)
      .collection("chats");

    // Verificar que el chat existe
    const chatRef = agentRef.doc(chatId);
    const chatSnapshot = await chatRef.get();

    if (!chatSnapshot.exists) {
      return notFound(res, "Chat not found");
    }

    // Referencia a la colección de mensajes
    const messagesRef = chatRef
      .collection("messages")
      .orderBy("createdAt", "desc")
      .offset(pageOffset)
      .limit(pageLimit);
    // Ejecutar query
    const messagesSnapshot = await messagesRef.get();

    // Extraer mensajes
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return success(res, {
      messages,
      offset: pageOffset,
      limit: pageLimit,
      count: messages.length,
      ...chatSnapshot.data(),
    });
  } catch (err) {
    console.error("Error getting messages by chat ID:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return error(res, "Failed to get messages", 500, errorMessage);
  }
};
