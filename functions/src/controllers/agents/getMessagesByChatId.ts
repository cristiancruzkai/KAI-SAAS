/**
 * Controller: Get Messages By Chat ID
 * Obtiene todos los mensajes de un chat dentro de un agente con paginación
 */

import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { db } from '../../config/firebase.config.js';
import { success, error, notFound } from '../../utils/http/response.js';

export const getMessagesByChatId = async (req: Request, res: Response): Promise<any> => {
    try {
        // Obtener parámetros del body
        const { 
            chatId, 
            agentId,
            limit = 20,              // Límite de mensajes por página (default: 20)
            lastMessageId = null     // ID del último mensaje de la página anterior (para cursor)
        } = req.body;

        if (!chatId) {
            return error(res, 'Chat ID is required', 400);
        }

        if (!agentId) {
            return error(res, 'Agent ID is required', 400);
        }

        // Validar que limit sea un número válido
        const pageLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100); // Entre 1 y 100

        // Obtener la colección de chats del agente
        const agentRef = db.collection('agent_configurations').doc(agentId).collection('chats');
        const agentSnapshot = await agentRef.doc(chatId).get();

        if (!agentSnapshot.exists) {
            return notFound(res, 'Chat not found');
        }

        const chatRef = agentRef.doc(chatId);
        const chatSnapshot = await chatRef.get();

        if (!chatSnapshot.exists) {
            return notFound(res, 'Chat not found');
        }

        // Referencia a la colección de mensajes
        const messagesRef = chatRef.collection('messages');

        // Construir query con paginación
        let query = messagesRef
            .orderBy('createdAt', 'desc')  // Ordenar por timestamp descendente (más recientes primero)
            .limit(pageLimit + 1);         // +1 para saber si hay más páginas

        // Si hay un cursor (lastMessageId), empezar después de ese mensaje
        if (lastMessageId) {
            const lastMessageDoc = await messagesRef.doc(lastMessageId).get();
            
            if (lastMessageDoc.exists) {
                query = query.startAfter(lastMessageDoc);
            }
        }

        // Ejecutar query
        const messagesSnapshot = await query.get();

        if (messagesSnapshot.empty && !lastMessageId) {
            // Si es la primera página y no hay mensajes
            return success(res, {
                messages: [],
                hasMore: false,
                total: 0,
                limit: pageLimit,
                ...chatSnapshot.data
            });
        }

        // Extraer mensajes
        const messages = messagesSnapshot.docs.slice(0, pageLimit).map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Verificar si hay más páginas
        const hasMore = messagesSnapshot.docs.length > pageLimit;

        // Obtener el ID del último mensaje para el siguiente cursor
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

        return success(res, {
            messages,
            hasMore,
            lastMessageId: lastMessage?.id || null,
            limit: pageLimit,
            count: messages.length
        });
    } catch (err) {
        console.error('Error getting messages by chat ID:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        return error(res, 'Failed to get messages', 500, errorMessage);
    }
};