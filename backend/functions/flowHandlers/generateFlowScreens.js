/* eslint-disable */
const admin = require("firebase-admin");
const { log, error } = require("firebase-functions/logger");
const db = admin.firestore();
const { KAI_AGENT_DOC_ID } = require('../config');

exports.generateNewInvoiceFlow = async (decryptedBody) => {
  const { screen, data, action, flow_token } = decryptedBody;

  if (action === "ping") {
    return { data: { status: "active" } };
  }

  // Extrae el ID de la factura desde el token del flujo.
  const params = new URLSearchParams(flow_token?.includes("?") ? flow_token.split("?")[1] : "");
  const invoiceId = params.get("invoiceId");

  // ## INIT: Muestra la pantalla inicial con los datos del cliente.
  if (action === "INIT") {
    console.log(`Iniciando flujo para factura: ${invoiceId}`);

    if (!invoiceId) {
      // Manejo de error si no hay ID de factura
      return {
        screen: "USER_DATA_SCREEN",
        data: {
          formatText: ["## ⚠️ Error", "No se especificó un ID de factura válido."],
        },
      };
    }

    try {
      const db = admin.firestore();

      const invoiceRef = db.collection("kai_agents").doc(KAI_AGENT_DOC_ID).collection("invoices").doc(invoiceId);
      const invoiceDoc = await invoiceRef.get();

      if (!invoiceDoc.exists) {
        return {
          screen: "USER_DATA_SCREEN",
          data: {
            formatText: ["## ⚠️ Error", `No se encontró una solicitud de factura con el ID: ${invoiceId}`],
          },
        };
      }

      const invoiceData = invoiceDoc.data();

      // Construye el texto formateado para el componente RichText
      const formattedText = [
        `## 📧 Email`,
        `- ${invoiceData.email || 'No proporcionado'}`,
        `## 📞 Teléfono`,
        `- ${invoiceData.phoneNumber || 'No proporcionado'}`,
        `[Toca aquí para ver el ticket](${invoiceData.receipt_photo_url || ''})`,
        `## Constancia de Situación Fiscal`,
        `[Toca aquí para ver la CSF](${invoiceData.tax_document_url || ''})`,
      ];

      return {
        screen: "USER_DATA_SCREEN",
        data: {
          formatText: formattedText,
        },
      };
    } catch (error) {
      console.error("Error al obtener datos de la factura:", error);
      return {
        screen: "USER_DATA_SCREEN",
        data: {
          formatText: ["## ❌ Error del Servidor", "Hubo un problema al cargar los datos. Intenta de nuevo."],
        },
      };
    }
  }

  // ## DATA_EXCHANGE: El usuario vio los datos y presiona "CONTINUAR".
  if (action === "data_exchange" && screen === "USER_DATA_SCREEN") {
    console.log(`Continuando a la pantalla de carga de factura para: ${invoiceId}.`);
    // Simplemente muestra la siguiente pantalla, que es estática.
    return {
      screen: "INVOICE_SCREEN",
      data: {},
    };
  }

  // ## Acción 'complete' o cualquier otra no manejada.
  console.log(`Acción '${action}' en pantalla '${screen}' no requiere nueva pantalla.`);
  return { data: { acknowledged: true } };
};


/* eslint-enable */
