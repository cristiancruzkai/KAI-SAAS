/* eslint-disable */
/**
 * Cloud Functions Entry Point
 * Exporta todas las funciones disponibles
 */

// ============================================================================
// AGENTS APIs - Para gestión de agentes en el panel
// ============================================================================

const { getAgentsByUserId } = require('./src/api/agents/getAgentsByUserId');
const { getAgentById } = require('./src/api/agents/getAgentById');
const { updateAgent } = require('./src/api/agents/updateAgent');
const { getCollectionByAgentId } = require('./src/api/agents/getCollectionByAgentId');

// ============================================================================
// BUILDER APIs - Para gestión de agentes en el panel
// ============================================================================

// Exportar funciones de Agents
exports.getAgentsByUserId = getAgentsByUserId;
exports.getAgentById = getAgentById;
exports.updateAgent = updateAgent;
exports.getCollectionByAgentId = getCollectionByAgentId;

// ============================================================================
// AUTH APIs - Para autenticación y gestión de usuarios
// ============================================================================

const { login } = require('./src/api/auth/login');
const { getUserProfile } = require('./src/api/auth/getUserProfile');
const { updatePassword } = require('./src/api/auth/updatePassword');
const { updateEmail } = require('./src/api/auth/updateEmail');
const { updateProfile } = require('./src/api/auth/updateProfile');

// Exportar funciones de Auth
exports.login = login;
exports.getUserProfile = getUserProfile;
exports.updatePassword = updatePassword;
exports.updateEmail = updateEmail;
exports.updateProfile = updateProfile;

// ============================================================================
// Agregar más APIs
// ============================================================================

/* eslint-enable */
