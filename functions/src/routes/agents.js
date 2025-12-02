import { onRequest } from "firebase-functions/https";
import { corsMiddleware } from "../middlewares/cors.js";
import {
  getAgentById,
  getAgentsByUserId,
  getCollectionByAgentId,
  updateAgent
} from "../controllers/agent.js";

export const kaiSaas_agent_getAgentById = onRequest(async (req, res) => {
  corsMiddleware(req, res);
  await getAgentById(req, res);
});

export const kaiSaas_agent_getAgentsByUserId = onRequest(async (req, res) => {
  corsMiddleware(req, res);
  await getAgentsByUserId(req, res);
});

export const kaiSaas_agent_getCollectionByAgentId = onRequest(async (req, res) => {
  corsMiddleware(req, res);
  await getCollectionByAgentId(req, res);
});

export const kaiSaas_agent_updateAgent = onRequest(async (req, res) => {
  corsMiddleware(req, res);
  await updateAgent(req, res);
});
