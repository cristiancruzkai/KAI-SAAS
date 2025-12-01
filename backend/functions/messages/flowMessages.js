/* eslint-disable */
const { log, error } = require("firebase-functions/logger");
const axios = require("axios");
const admin = require("firebase-admin");
const uuid = require("uuid");
const db = admin.firestore();
// const Mixpanel = require("mixpanel");
const { PHONE_NUMBER_ID_BUSINESS, WHATSAPP_TOKEN_BUSINESS } = require("../config");
// const { WHATSAPP_TOKEN_AGENT, PHONE_NUMBER_ID_AGENT } = require("../config");

const urlWhatsapp = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_BUSINESS}/messages`;
// const urlWhatsapp = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID_AGENT}/messages`;

exports.sendFlowMessageB2B = async (advisorPhoneNumber, clientPhoneNumber, clientName, flowData, flowParams, formattedText, customMessageData = null) => {
  const flowTokenId = uuid.v4();
  const flowToken = `${flowTokenId}?${flowParams.toString()}`;

  let dataToSend = {
    formatText: ["## ⚠️ Error", "No se especificó un ID de flujo válido."],
  }

  try {
    dataToSend = {
      formatText: formattedText,
    };
  } catch (error) {
    console.error("Error al obtener datos de la factura:", error);

    dataToSend = {
      formatText: ["## ❌ Error del Servidor", "Hubo un problema al cargar los datos. Intenta de nuevo."],
    };
  }

  const messageData = customMessageData ?? {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: advisorPhoneNumber,
    type: "template",
    template: {
      name: "terza_supp",
      language: {
        code: "es",
        policy: "deterministic"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: clientName,
            },
            {
              type: "text",
              text: clientPhoneNumber,
            },
          ]
        },
        {
          type: "button",
          sub_type: "flow",
          index: "0",
          parameters: [
            {
              type: "action",
              action: {
                flow_token: flowToken,
                flow_action_data: dataToSend,
              }
            }
          ]
        },
      ]
    },
  };

  /*
    const messageData = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: advisorPhoneNumber,
    type: "interactive",
    interactive: {
      type: "flow",
      body: {
        text: dataToSend.formatText.join("\n\n"),
      },
      action: {
        name: "flow",
        parameters: {
          flow_id: "1523362782214501",
          flow_message_version: "3",
          flow_token: flowToken,
          flow_cta: "Responder consulta",
          flow_action: "data_exchange",
          mode: "draft",
        },
      },
    },
  };
  */

  try {
    await axios.post(urlWhatsapp, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN_BUSINESS}`,
        // Authorization: `Bearer ${WHATSAPP_TOKEN_AGENT}`,
        "Content-Type": "application/json",
      }
    });
  } catch (err) {
    console.error(`Error al enviar notificación de flujo al usuario ${advisorPhoneNumber}:`, err.response ? err.response.data : err.message);

    return { success: false, message: `Error al enviar Flow: ${err}` };
  }

  return { success: true, message: "Flow enviado con éxito" };
}
/* eslint-enable */
