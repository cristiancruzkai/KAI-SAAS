/**
 * Entry Point: Firebase Functions
 * Exporta todas las Cloud Functions
 */

// Agent Routes
export {
  kaiSaas_agent_getAgentById,
  kaiSaas_agent_getAgentsByUserId,
  kaiSaas_agent_getCollectionByAgentId,
  kaiSaas_agent_getMessagesByChatId,
  // kaiSaas_agent_updateAgent,
} from "./routes/agents.js";

// TODO: Auth Routes
// export {
//   kaiSaas_auth_login,
//   kaiSaas_auth_getUserProfile,
//   kaiSaas_auth_updatePassword,
//   kaiSaas_auth_updateEmail,
//   kaiSaas_auth_updateProfile,
// } from './routes/auth.js';
