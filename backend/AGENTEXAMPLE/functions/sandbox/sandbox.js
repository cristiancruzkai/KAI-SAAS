/* eslint-disable */
const axios = require('axios');
const admin = require("firebase-admin");
const moment = require('moment-timezone');
const uuid = require('uuid');
const Mixpanel = require('mixpanel');
const { log, error } = require("firebase-functions/logger");
const { user } = require('firebase-functions/v1/auth');


exports.generateMessageInfo = async (bodyMessage, req, res) => {


    log(`bodyMessage: ${JSON.stringify(bodyMessage)}`);


    let UrlToUse = `https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/processChikasNailsWebhook`;

    try {
        /*const response = await axios.post(
          UrlToUse,
          { 
              data: bodyMessage
          },
          {
              headers: {
                  //'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
                  'Content-Type': 'application/json'
              }
          }
        );*/

        let response = await axios.post(UrlToUse, bodyMessage);

        let stringResponse = JSON.stringify(response.data);

        let data = response.data;
        let status = data['status'];

        //log(`Respuesta: ${JSON.stringify(response)}`);

        /* if (status === 200) {
           log('Respuesta exitosa');
           log(`Data: ${JSON.stringify(data)}`);
     
           return `Response of request: ${JSON.stringify(data)}`;
         } else {
             return `There was an error`;
         }*/

        return `Terminó operación: ${response}`;

    } catch (error) {
        //console.error('Error sending request:', error);

        let completeError = error.stack;


        if (error.response) {
            log(`Error response data: ${JSON.stringify(error.response.data, null, 2)}`);
            log(`Error response status: ${error.response.status}`);
            log(`Error response headers: ${JSON.stringify(error.response.headers, null, 2)}`);
            completeError = JSON.stringify(error.response.data, null, 2);
        } else if (error.request) {
            // Si no hubo respuesta, pero se envió una solicitud
            log('No response received.');
            log(`Request method: ${error.request.method}`);
            log(`Request path: ${error.request.path}`);
            // No intentes hacer JSON.stringify completo
            completeError = `Request failed with no response. Method: ${error.request.method}, Path: ${error.request.path}`;
            //completeError = JSON.stringify(error.request, null, 2);
        } else {
            // Si el error ocurrió antes de enviar la solicitud
            log(`Error setting up the request: ${error.message}`);
            completeError = error.stack;
        }

        log(`Error sending request: ${completeError}`);
        return `There was an error: ${completeError}`;
    }
}
/* eslint-enable */
