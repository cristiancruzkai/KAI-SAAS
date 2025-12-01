// index.js
/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { log, error } = require("firebase-functions/logger");
const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { VertexAI } = require("@google-cloud/vertexai");
const Mixpanel = require("mixpanel");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'gs://asistente-comercial-8d43c.firebasestorage.app'
});

const { generateMessageInfo } = require("./sandbox/sandbox");
const { generateMessageProducInfo } = require("./production/production");
const { processChikasNailsWebhook } = require("./processEventWebhook");

exports.whatsappWebhookChikasNails = functions.https.onRequest(async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  const verifyToken = process.env.VERIFY_TOKEN;

  if (req.method === 'GET') {
    // 🔒 VERIFICACIÓN DEL WEBHOOK
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    log(`verifyToken: ${verifyToken}`);
    log(`mode: ${mode}`);
    log(`token: ${token}`);
    log(`challenge: ${challenge}`);

    if (mode && token === verifyToken) {
      log('Webhook verificado con éxito');
      return res.status(200).send(challenge);
    } else {
      log('Verificación fallida. Tokens no coinciden.');
      return res.sendStatus(403);
    }
  }



  try {

    const data = req.body;

    log(`data: ${JSON.stringify(data)}`);

    if (data.object === 'whatsapp_business_account') {
      data.entry.forEach(entry => {
        const changes = entry.changes;
        changes.forEach(async change => {

          const display_number = change.value.metadata.display_phone_number;


          log(`display_number: ${display_number}`);

          if (display_number === '5219931485874') {
            log(`Es Factura 360`);
            if (change.value.messages && change.value.messages.length > 0) {
              const message = change.value.messages[0];
              const senderPhoneNumber = message.from;
              const textBody = message.text ? message.text.body : null;

              const prevWhatsID = message.context ? message.context.id : null;

              //await processEventWebhook(message,change,req,res);

              let resultProcessing = await generateMessageProducInfo(data, req, res);
              log(`resultProcessing: ${JSON.stringify(resultProcessing)}`);

              return res.sendStatus(200).send('Terminó operación.');


            } else {
              return res.sendStatus(200).send('No contiene mensajes el registro.');
            }
          } else {
            log(`Es otro número`);
            return res.sendStatus(200).send('Terminó operación.');
          }

        });
      });
    } else {

      log('Es un tipo de cuenta diferente');
      res.sendStatus(200).send('Cuenta diferente');
    }

  } catch (error) {

    let completeError = error.stack;
    //error(errorSuscription);
    //log(`Error comppleto: ${completeError}`);

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

    // Opcional: Imprime el stack trace completo para depuración
    log(`Stack trace: ${error.stack}`);

    res.sendStatus(400).send('Error en la cloud function webhook');
  }


});

exports.processChikasNailsWebhook = processChikasNailsWebhook
/* eslint-enable */
