/**
 * Routes: Agents
 * Define las Cloud Functions HTTP para operaciones de agentes
 */

import { onRequest } from "firebase-functions/v2/https";
import { corsMiddleware } from "../middlewares/cors.js";
import { getAgentById } from "../controllers/agents/getAgentById.js";
import { getAgentsByUserId } from "../controllers/agents/getAgentsByUserId.js";
import { getCollectionByAgentId } from "../controllers/agents/getCollectionByAgentId.js";
import { getMessagesByChatId } from "../controllers/agents/getMessagesByChatId.js";
// import { updateAgent } from '../controllers/agents/updateAgent.js';

/**
 * Cloud Function: Obtener agente por ID
 */
export const kaiSaas_agent_getAgentById = onRequest(
  {
    cors: true,
  },
  async (req, res) => {
    corsMiddleware(req, res as any);
    await getAgentById(req, res as any);
  },
);

/**
 * Cloud Function: Obtener agentes por User ID
 * TODO: Migrar getAgentsByUserId a TypeScript
 */
export const kaiSaas_agent_getAgentsByUserId = onRequest(
  {
    cors: true,
  },
  async (req, res) => {
    corsMiddleware(req, res as any);
    await getAgentsByUserId(req, res as any);
  },
);

/**
 * Cloud Function: Obtener colección de agente
 * TODO: Migrar getCollectionByAgentId a TypeScript
 */
export const kaiSaas_agent_getCollectionByAgentId = onRequest(
  {
    cors: true,
  },
  async (req, res) => {
    corsMiddleware(req, res as any);
    await getCollectionByAgentId(req, res as any);
  },
);

export const kaiSaas_agent_getMessagesByChatId = onRequest(
  {
    cors: true,
  },
  async (req, res) => {
    corsMiddleware(req, res as any);
    await getMessagesByChatId(req, res as any);
  },
);
/**
 * Cloud Function: Actualizar agente
 * TODO: Migrar updateAgent a TypeScript
 */
// export const kaiSaas_agent_updateAgent = onRequest(
//   {
//     cors: true,
//   },
//   async (req, res) => {
//     corsMiddleware(req, res);
//     await updateAgent(req, res);
//   }
// );
