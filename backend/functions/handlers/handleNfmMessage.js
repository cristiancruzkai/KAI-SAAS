/* eslint-disable */
const axios = require('axios');
const admin = require("firebase-admin");
const uuid = require('uuid');
const { log, error } = require("firebase-functions/logger");
const { sendTextAgentMessage } = require("../messages/messages");
const { createMessageChat } = require("../support/chatAgentSupport");

const processNewChikasnailsAppointmentSchedulingFlow = async (message, userInfo) => {
  const KAI_AGENT_DOC_ID = process.env.KAI_AGENT_DOC_ID_CHIKASNAILS;
  const db = admin.firestore();
  const responseJsonRaw = message?.interactive?.nfm_reply?.response_json;
  const flowPayload = JSON.parse(responseJsonRaw);
  const flowToken = flowPayload.flow_token;
  const params = new URLSearchParams(flowToken.split("?")[1]);
  const senderPhoneNumber = params.get("senderPhoneNumber");

  const name = params.get("name");
  const service = params.get("service");
  const leadId = params.get("appointmentId");

  let sendMessage = ``;

  if (!name || !service || !senderPhoneNumber || !leadId) {
    await sendTextAgentMessage(`😕 Ups, algo no salió como esperábamos. Por favor, inténtalo de nuevo en unos momentos`, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    return;
  }

  const leadRef = db.collection("kai_agents").doc(KAI_AGENT_DOC_ID).collection("appointments").doc(leadId);
  const leadSnap = await leadRef.get();

  if (!leadSnap.exists) {
    sendMessage = `Error: Solicitud de soporte no encontrada en la base de datos`;
    try {
      await sendTextAgentMessage(`😕 Ups, algo no salió como esperábamos. Por favor, inténtalo de nuevo en unos momentos`, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (error) {
      log("Error al enviar mensaje de error:", error);
    }
    return;
  }

  const leadData = leadSnap.data();

  if (leadData.status === "completed" || leadData === "resolved") {
    sendMessage = `> Solicitud ya atendida\nLa solicitud ya fue atendida anteriormente por ${leadData.asesorName || "otro asesor"}.`;
    try {
      await sendTextAgentMessage(sendMessage, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (error) {
      console.error("Error al enviar mensaje de solicitud atendida:", error);
    }
    return;
  }

  const msgCliente = `Gracias ${name} tu cita fue registrada con éxito, un asesor se pondrá en contacto contigo pronto.`;

  try {
    await leadRef.update({
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedBy: userInfo.uid,
      resolvedBy: userInfo.uid,
      asesorID: userInfo.uid,
      asesorName: userInfo.name,
      asesorPhoneNumber: userInfo.phoneNumber,
    });

    const userRef = db
      .collection("kai_agents")
      .doc(KAI_AGENT_DOC_ID)
      .collection("users")
      .doc(userInfo.uid);

    await userRef.update({
      asesorID: userInfo.uid,
      asesorName: userInfo.name,
      asesorPhoneNumber: userInfo.phoneNumber,
    });
  } catch (error) {
    console.log("❌ Error al actualizar estado de la cita:", error);
    msgCliente = `❌ Error al actualizar el estado de la cita`;
    try {
      // await sendTextMessageToKaiTesting(msgCliente, userInfo.phoneNumber);
      await sendTextAgentMessage(msgCliente, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (sendError) {
      console.log("❌ Error al enviar mensaje de error de actualización:", sendError);
    }
    return;
  }

  try {
    await sendTextAgentMessage(msgCliente, senderPhoneNumber, '', userInfo.uid);

    const userAgentInfo = await db
      .collection("kai_agents")
      .doc(KAI_AGENT_DOC_ID)
      .collection("users")
      .doc(userInfo.uid)
      .get();

    if (userAgentInfo.exists) {
      var data = userAgentInfo.data();
      await createMessageChat(data, 'model', msgCliente, 'text', false);
    }
  } catch (error) {
    console.log("❌ Error al enviar mensaje al cliente:", error);
  }

  let formattedDate = "";
  let formattedHour = "";

  if (leadData.createdAt) {
    const date = leadData.createdAt.toDate ? leadData.createdAt.toDate() : new Date(leadData.createdAt);

    const dateOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Mexico_City",
    };

    formattedDate = date.toLocaleDateString("es-MX", dateOptions);
    formattedHour = date.toLocaleTimeString("es-MX", timeOptions);
  }

  const formattedText = [
    `⏰ Fecha y hora de registro`,
    `- ${formattedDate} ${formattedHour}`,
    `📱 Teléfono`,
    `- ${leadData.phoneNumber}`,
    `📧 Nombre`,
    `- ${leadData.name}`,
    `💅 Servicio`,
    `- ${leadData.service}`,
  ];

  sendMessage = formattedText.join("\n");

  try {
    await sendTextAgentMessage(sendMessage, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
  } catch (error) {
    console.log("❌ Error al enviar detalles de la cita al asesor:", error);
  }
}

const processNewChikasnailsRequestAssistanceFlow = async (message, userInfo) => {
  const KAI_AGENT_DOC_ID = process.env.KAI_AGENT_DOC_ID_CHIKASNAILS;
  const db = admin.firestore();
  const responseJsonRaw = message?.interactive?.nfm_reply?.response_json;
  const flowPayload = JSON.parse(responseJsonRaw);
  const flowToken = flowPayload.flow_token;
  const params = new URLSearchParams(flowToken.split("?")[1]);
  const senderPhoneNumber = params.get("senderPhoneNumber");

  const name = params.get("name");
  const assistance_details = params.get("assistance_details");
  const leadId = params.get("requestId");

  let sendMessage = ``;

  if (!name || !assistance_details || !senderPhoneNumber || !leadId) {
    await sendTextAgentMessage(`😕 Ups, algo no salió como esperábamos. Por favor, inténtalo de nuevo en unos momentos`, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    return;
  }

  const leadRef = db.collection("kai_agents").doc(KAI_AGENT_DOC_ID).collection("requests").doc(leadId);
  const leadSnap = await leadRef.get();

  if (!leadSnap.exists) {
    sendMessage = `Error: Solicitud de soporte no encontrada en la base de datos`;
    try {
      await sendTextAgentMessage(`😕 Ups, algo no salió como esperábamos. Por favor, inténtalo de nuevo en unos momentos`, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (error) {
      log("Error al enviar mensaje de error:", error);
    }
    return;
  }

  const leadData = leadSnap.data();

  if (leadData.status === "completed" || leadData.status === "resolved") {
    sendMessage = `> Solicitud ya atendida\nLa solicitud ya fue atendida anteriormente por ${leadData.asesorName || "otro asesor"}.`;
    try {
      await sendTextAgentMessage(sendMessage, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (error) {
      console.error("Error al enviar mensaje de solicitud atendida:", error);
    }
    return;
  }

  const msgCliente = `Gracias ${name} tu cita fue registrada con éxito, un asesor se pondrá en contacto contigo pronto.`;

  try {
    await leadRef.update({
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedBy: userInfo.uid,
      resolvedBy: userInfo.uid,
      asesorID: userInfo.uid,
      asesorName: userInfo.name,
      asesorPhoneNumber: userInfo.phoneNumber,
    });

    const userRef = db
      .collection("kai_agents")
      .doc(KAI_AGENT_DOC_ID)
      .collection("users")
      .doc(userInfo.uid);

    await userRef.update({
      asesorID: userInfo.uid,
      asesorName: userInfo.name,
      asesorPhoneNumber: userInfo.phoneNumber,
    });
  } catch (error) {
    console.log("❌ Error al actualizar estado de la cita:", error);
    msgCliente = `❌ Error al actualizar el estado de la cita`;
    try {
      // await sendTextMessageToKaiTesting(msgCliente, userInfo.phoneNumber);
      await sendTextAgentMessage(msgCliente, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (sendError) {
      console.log("❌ Error al enviar mensaje de error de actualización:", sendError);
    }
    return;
  }

  try {
    await sendTextAgentMessage(msgCliente, senderPhoneNumber, '', userInfo.uid);

    const userAgentInfo = await db
      .collection("kai_agents")
      .doc(KAI_AGENT_DOC_ID)
      .collection("users")
      .doc(userInfo.uid)
      .get();

    if (userAgentInfo.exists) {
      var data = userAgentInfo.data();
      await createMessageChat(data, 'model', msgCliente, 'text', false);
    }
  } catch (error) {
    console.log("❌ Error al enviar mensaje al cliente:", error);
  }

  let formattedDate = "";
  let formattedHour = "";

  if (leadData.createdAt) {
    const date = leadData.createdAt.toDate ? leadData.createdAt.toDate() : new Date(leadData.createdAt);

    const dateOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Mexico_City",
    };

    formattedDate = date.toLocaleDateString("es-MX", dateOptions);
    formattedHour = date.toLocaleTimeString("es-MX", timeOptions);
  }

  const formattedText = [
    `⏰ Fecha y hora de registro`,
    `- ${formattedDate} ${formattedHour}`,
    `📱 Teléfono`,
    `- ${leadData.phoneNumber}`,
    `📧 Nombre`,
    `- ${leadData.name}`,
    `💅 Detalles de asistencia`,
    `- ${leadData.assistance_details}`,
  ];

  sendMessage = formattedText.join("\n");

  try {
    await sendTextAgentMessage(sendMessage, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
  } catch (error) {
    console.log("❌ Error al enviar detalles de la cita al asesor:", error);
  }
}

const processNewChikasnailsOrderFlow = async (message, userInfo) => {
  const KAI_AGENT_DOC_ID = process.env.KAI_AGENT_DOC_ID_CHIKASNAILS;
  const db = admin.firestore();
  const responseJsonRaw = message?.interactive?.nfm_reply?.response_json;
  const flowPayload = JSON.parse(responseJsonRaw);
  const flowToken = flowPayload.flow_token;
  const params = new URLSearchParams(flowToken.split("?")[1]);
  const senderPhoneNumber = params.get("senderPhoneNumber");

  const customerName = params.get("customerName");
  const orderNumber = params.get("orderNumber");
  const productsSummary = params.get("productsSummary");
  const totalPriceQuoted = params.get("totalPriceQuoted");
  const deliveryAddress = params.get("deliveryAddress");
  const leadId = params.get("orderId");

  let sendMessage = ``;

  if (!customerName || !productsSummary || !totalPriceQuoted || !deliveryAddress || !orderNumber || !senderPhoneNumber || !leadId) {
    await sendTextAgentMessage(`😕 Ups, algo no salió como esperábamos. Por favor, inténtalo de nuevo en unos momentos`, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    return;
  }

  const leadRef = db.collection("kai_agents").doc(KAI_AGENT_DOC_ID).collection("orders").doc(leadId);
  const leadSnap = await leadRef.get();

  if (!leadSnap.exists) {
    sendMessage = `Error: Solicitud de soporte no encontrada en la base de datos`;
    try {
      await sendTextAgentMessage(`😕 Ups, algo no salió como esperábamos. Por favor, inténtalo de nuevo en unos momentos`, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (error) {
      log("Error al enviar mensaje de error:", error);
    }
    return;
  }

  const leadData = leadSnap.data();

  if (leadData.status === "completed" || leadData.status === "resolved") {
    sendMessage = `> Solicitud ya atendida\nLa solicitud ya fue atendida anteriormente por ${leadData.asesorName || "otro asesor"}.`;
    try {
      await sendTextAgentMessage(sendMessage, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (error) {
      console.error("Error al enviar mensaje de solicitud atendida:", error);
    }
    return;
  }

  const msgCliente = `Gracias ${customerName} tu cita fue registrada con éxito, un asesor se pondrá en contacto contigo pronto.`;

  try {
    await leadRef.update({
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedBy: userInfo.uid,
      resolvedBy: userInfo.uid,
      asesorID: userInfo.uid,
      asesorName: userInfo.name,
      asesorPhoneNumber: userInfo.phoneNumber,
    });

    const userRef = db
      .collection("kai_agents")
      .doc(KAI_AGENT_DOC_ID)
      .collection("users")
      .doc(userInfo.uid);

    await userRef.update({
      asesorID: userInfo.uid,
      asesorName: userInfo.name,
      asesorPhoneNumber: userInfo.phoneNumber,
    });
  } catch (error) {
    console.log("❌ Error al actualizar estado de la cita:", error);
    msgCliente = `❌ Error al actualizar el estado de la cita`;
    try {
      // await sendTextMessageToKaiTesting(msgCliente, userInfo.phoneNumber);
      await sendTextAgentMessage(msgCliente, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
    } catch (sendError) {
      console.log("❌ Error al enviar mensaje de error de actualización:", sendError);
    }
    return;
  }

  try {
    await sendTextAgentMessage(msgCliente, senderPhoneNumber, '', userInfo.uid);

    const userAgentInfo = await db
      .collection("kai_agents")
      .doc(KAI_AGENT_DOC_ID)
      .collection("users")
      .doc(userInfo.uid)
      .get();

    if (userAgentInfo.exists) {
      var data = userAgentInfo.data();
      await createMessageChat(data, 'model', msgCliente, 'text', false);
    }
  } catch (error) {
    console.log("❌ Error al enviar mensaje al cliente:", error);
  }

  let formattedDate = "";
  let formattedHour = "";

  if (leadData.createdAt) {
    const date = leadData.createdAt.toDate ? leadData.createdAt.toDate() : new Date(leadData.createdAt);

    const dateOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Mexico_City",
    };

    formattedDate = date.toLocaleDateString("es-MX", dateOptions);
    formattedHour = date.toLocaleTimeString("es-MX", timeOptions);
  }

  const formattedText = [
    `⏰ Fecha y hora de registro`,
    `- ${formattedDate} ${formattedHour}`,
    `📱 Teléfono`,
    `- ${leadData.phoneNumber}`,
    `📧 Nombre`,
    `- ${leadData.customerName}`,
    `💅 Detalles de la Orden`,
    `- Numero de Orden: ${leadData.orderNumber}`,
    `- Productos: ${leadData.productsSummary}`,
    `- Total: $${leadData.totalPriceQuoted} MXN`,
    `- Dirección de Entrega: ${leadData.deliveryAddress}`,
  ];

  sendMessage = formattedText.join("\n");

  try {
    await sendTextAgentMessage(sendMessage, userInfo.phoneNumber, userInfo.companyID, userInfo.uid);
  } catch (error) {
    console.log("❌ Error al enviar detalles de la cita al asesor:", error);
  }
}

exports.handleNfmMessage = async (message, userInfo) => {
  const responseJsonRaw = message?.interactive?.nfm_reply?.response_json;
  const flowPayload = JSON.parse(responseJsonRaw);
  const flowToken = flowPayload.flow_token;
  const params = new URLSearchParams(flowToken.split("?")[1]);
  const type = params.get("type");

  if (type === "appointment_scheduling_chikasnails_flow_v1") {
    await processNewChikasnailsAppointmentSchedulingFlow(message, userInfo);
  } else if (type === "request_assistance_chikasnails_flow_v1") {
    await processNewChikasnailsRequestAssistanceFlow(message, userInfo);
  } else if (type === "new_chikasnails_order_v1") {
    await processNewChikasnailsOrderFlow(message, userInfo);
  } else {
    console.log("Tipo de flujo no reconocido:", type);
  }

};
/* eslint-enable */
