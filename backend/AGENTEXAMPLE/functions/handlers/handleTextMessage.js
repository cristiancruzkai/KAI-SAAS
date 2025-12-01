/* eslint-disable */

const { generateMCPProcess } = require("../MCP/ProcessMCP");

exports.handleTextMessage = async (message, from, actualUser) => {
  try {
    const text = message.text?.body || '';
    const messageType = message.type || 'text';

    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.log(`⚠️ Mensaje vacío recibido de ${from}, ignorando.`);
      return;
    }

    console.log(`📨 Mensaje recibido de ${from}: "${text}"`);

    //- Enviar el mensaje para el procesamiento MCP
    await generateMCPProcess(text, from, actualUser, from, messageType, null, null);
    

  } catch (error) {
  
      let completeError = error.stack;
      
  
      if (error.response) {
          log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
          log(`Error response status: ${error.response.status}`);
          log(`Error response headers: ${JSON.stringify(error.response.headers, null, 2)}`);
          completeError = JSON.stringify(error.response.data, null, 2);
      } else if (error.request) {
          // Si no hubo respuesta, pero se envió una solicitud
          log(`No response received. Request details: ${JSON.stringify(error.request, null, 2)}`);
          completeError = JSON.stringify(error.request, null, 2);
      } else {
          // Si el error ocurrió antes de enviar la solicitud
          log(`Error setting up the request: ${error.message}`);
          completeError = error.stack;
      }
    
      log(`completeError: ${completeError}`);
      
    }
};

/* eslint-enable */

