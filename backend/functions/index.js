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

// Exportar funciones de Agents
exports.getAgentsByUserId = getAgentsByUserId;
exports.getAgentById = getAgentById;
exports.updateAgent = updateAgent;
exports.getCollectionByAgentId = getCollectionByAgentId;

// ============================================================================
// Agregar más APIs aquí según sea necesario
// ============================================================================

/* eslint-enable */
