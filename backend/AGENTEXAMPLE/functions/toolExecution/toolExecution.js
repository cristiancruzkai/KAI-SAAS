/* eslint-disable */
const axios = require("axios");
const admin = require("firebase-admin");
const uuid = require("uuid");
const { log } = require("firebase-functions/logger");
const moment = require("moment-timezone");
const Mixpanel = require("mixpanel");
const {
  getResultResponse,
  processknowledgeBasePrompt,
  parseDeliveryAddress,
} = require("./toolExecutionSupport");
const { sendPdfDocumentMessage, sendImageMessage, sendVideoMessage, sendFlowsToBusinessUsers, sendTextAgentMessage } = require("../messages/messages");
const { getDate } = require("../LLM/prompt");
const { GoogleGenAI } = require('@google/genai');
const { MIX_TOKEN, GEMINI_API_KEY, firestorePaths } = require("../config");

exports.queryKnowledgeBase = async (actualUser, args) => {
  var mixpanel = Mixpanel.init(MIX_TOKEN, {
    debug: true,
  });

  log(`Entrando en la función queryKnowledgeBase`);

  try {
    // Obtener todos los documentos de la colección de FAQ
    const faqsRef = firestorePaths.faqsCollection();
    const faqsSnapshot = await faqsRef.get();

    log(`Se encontraron ${faqsSnapshot.docs.length} documentos en la colección de FAQ`);

    if (faqsSnapshot.empty) {
      log(`No se encontraron documentos en la colección FAQ`);
      return getResultResponse(
        false,
        "No se encontraron preguntas frecuentes en la base de datos.",
        []
      );
    }

    // Extraer pregunta y respuesta de cada documento con estructura actualizada
    const knowledgeBase = [];

    faqsSnapshot.forEach((doc, index) => {
      try {
        const faqData = doc.data();

        if (faqData && faqData.question && faqData.answer) {
          const knowledgeEntry = {
            id: faqData.id || `faq_${index + 1}`,
            title: faqData.question,
            description: faqData.answer,
            multimedia_type: null,
            multimedia_url: null,
            multimedia_mime_type: null,
            multimedia_name: null
          };

          // Verificar si tiene archivo multimedia (imagen, documento o video)
          if (faqData.image && faqData.image.url && faqData.image.mediaType) {
            knowledgeEntry.multimedia_type = faqData.image.mediaType;
            knowledgeEntry.multimedia_url = faqData.image.url;

            // Si es un documento, agregar mime_type y nombre
            if (faqData.image.mediaType === "document") {
              knowledgeEntry.multimedia_mime_type = faqData.image.mime_type || "application/pdf";
              knowledgeEntry.multimedia_name = faqData.image.name || "documento.pdf";
            }

            // Si es un video, agregar mime_type y nombre
            if (faqData.image.mediaType === "video") {
              knowledgeEntry.multimedia_mime_type = faqData.image.mime_type || "video/mp4";
              knowledgeEntry.multimedia_name = faqData.image.name || "video.mp4";
            }
          }

          knowledgeBase.push(knowledgeEntry);
        }
      } catch (docError) {
        log(`Error al procesar documento ${index + 1}: ${docError.message}`);
      }
    });

    log(`Se procesaron ${knowledgeBase.length} preguntas frecuentes`);

    if (knowledgeBase.length === 0) {
      return getResultResponse(
        false,
        "No se encontraron preguntas frecuentes válidas en la base de datos.",
        []
      );
    }

    // Obtener la pregunta del usuario desde args
    const userQuery = args?.query || args?.question || "Información general sobre servicios";

    // Llamar al modelo de IA para procesar la consulta
    const aiResponse = await processknowledgeBasePrompt(actualUser, {
      user_query: userQuery,
      knowledge_base: knowledgeBase
    });

    if (aiResponse.success) {
      // Verificar si hay multimedia para enviar
      if (aiResponse.data.multimedia_type === "image" && aiResponse.data.multimedia_url) {
        try {
          log(`Enviando imagen multimedia: ${aiResponse.data.multimedia_url}`);
          const imageResult = await sendImageMessage(aiResponse.data.multimedia_url, actualUser.phoneNumber);
          log(`Resultado del envío de imagen: ${imageResult}`);
        } catch (imageError) {
          log(`Error enviando imagen: ${imageError.message}`);
          // No fallar la función completa si hay error enviando la imagen
        }
      } else if (aiResponse.data.multimedia_type === "document" && aiResponse.data.multimedia_url) {
        try {
          const documentName = aiResponse.data.multimedia_name || "documento.pdf";
          const caption = ""; // Opcional: podrías agregar un caption si lo necesitas
          log(`Enviando documento PDF: ${aiResponse.data.multimedia_url}, nombre: ${documentName}`);
          const documentResult = await sendPdfDocumentMessage(aiResponse.data.multimedia_url, documentName, caption, actualUser.phoneNumber);
          log(`Resultado del envío de documento: ${documentResult}`);
        } catch (documentError) {
          log(`Error enviando documento: ${documentError.message}`);
          // No fallar la función completa si hay error enviando el documento
        }
      } else if (aiResponse.data.multimedia_type === "video" && aiResponse.data.multimedia_url) {
        try {
          const videoName = aiResponse.data.multimedia_name || "video.mp4";
          const caption = ""; // Opcional: podrías agregar un caption si lo necesitas
          log(`Enviando video: ${aiResponse.data.multimedia_url}, nombre: ${videoName}`);
          const videoResult = await sendVideoMessage(aiResponse.data.multimedia_url, videoName, caption, actualUser.phoneNumber);
          log(`Resultado del envío de video: ${videoResult}`);
        } catch (videoError) {
          log(`Error enviando video: ${videoError.message}`);
          // No fallar la función completa si hay error enviando el video
        }
      }

      // Preparar la respuesta sin información multimedia para el modelo
      const responseForModel = {
        responseText: aiResponse.data.responseText,
        source_ids: aiResponse.data.source_ids || []
      };

      return getResultResponse(
        true,
        aiResponse.data.responseText,
        responseForModel,
        aiResponse.data.multimedia_type,
        aiResponse.data.multimedia_url
      )
    }
    return getResultResponse(
      false,
      "Lo siento, tuve un problema al procesar tu consulta. ¿Podrías intentar nuevamente? 🔄",
      []
    );
  } catch (error) {
    log(`Error en queryKnowledgeBase: ${error.message}`);

    mixpanel.track('error_log', {
      section: 'Error al obtener preguntas frecuentes',
      companyID: actualUser.companyID,
      userID: actualUser.uid,
      function: 'query_knowledge_base',
      error: error.message,
    });

    return getResultResponse(
      false,
      "Lo siento, tuve un problema al obtener las preguntas frecuentes. ¿Podrías intentar nuevamente? 🔄",
      []
    );
  }
};

exports.appointmentScheduling = async (actualUser, args) => {
  const appointmentId = uuid.v4();
  const appointmentRef = firestorePaths.appointmentsCollection().doc(appointmentId);
  try {
    await appointmentRef.set({
      status: "pending",
      id: appointmentId,
      name: args.name,
      service: args.service,
      phoneNumber: actualUser.phoneNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: actualUser.uid,
    });
  } catch (err) {
    console.error("❌ Error al crear la cita en Firestore:", err);
    return getResultResponse(
      false,
      "Hubo un problema al solicitar la programación de la cita. Por favor, intenta nuevamente más tarde.",
      {}
    );
  }
  const flowData = {
    type: `appointment_scheduling_chikasnails_flow_v1`,
    name: args.name,
    service: args.service,
  };
  const flowParams = new URLSearchParams({
    ...flowData,
    senderPhoneNumber: actualUser.phoneNumber,
    appointmentId,
  });
  const formattedText = [
    `## ⏰ Fecha y hora`,
    `- ${new Date().toLocaleString('es-MX')}`,
    `## 📱 Teléfono`,
    `- ${actualUser.phoneNumber}`,
    `## 📧 Nombre`,
    `- ${flowData.name}`,
    `## 📦 Servicio`,
    `- ${flowData.service}`,
  ];
  const flowResult = await sendFlowsToBusinessUsers(
    actualUser.phoneNumber,
    args.name,
    flowData,
    flowParams,
    formattedText,
  );

  if (!flowResult.success) {
    return getResultResponse(
      false,
      flowResult.message || "Hubo un problema al solicitar la programación de la cita.",
      { ...flowResult.count },
    )
  }

  return getResultResponse(
    true,
    flowResult.message || "Solicitud de programación de cita enviada correctamente.",
    { ...flowResult.count },
  );
}

exports.requestAssistance = async (actualUser, args) => {
  const requestId = uuid.v4();
  const requestRef = firestorePaths.requestsCollection().doc(requestId);
  try {
    await requestRef.set({
      status: "pending",
      id: requestId,
      name: args.name,
      assistance_details: args.assistance_details,
      phoneNumber: actualUser.phoneNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: actualUser.uid,
    });
  } catch (err) {
    console.error("❌ Error al crear la solicitud de asistencia en Firestore:", err);
    return getResultResponse(
      false,
      "Hubo un problema al solicitar la asistencia. Por favor, intenta nuevamente más tarde.",
      {}
    );
  }
  const flowData = {
    type: `request_assistance_chikasnails_flow_v1`,
    name: args.name,
    assistance_details: args.assistance_details,
  };
  const flowParams = new URLSearchParams({
    ...flowData,
    senderPhoneNumber: actualUser.phoneNumber,
    requestId,
  });
  const formattedText = [
    `## ⏰ Fecha y hora`,
    `- ${new Date().toLocaleString('es-MX')}`,
    `## 📱 Teléfono`,
    `- ${actualUser.phoneNumber}`,
    `## 📧 Nombre`,
    `- ${flowData.name}`,
    `## 📦 Detalles de Asistencia`,
    `- ${flowData.assistance_details}`,
  ];
  const flowResult = await sendFlowsToBusinessUsers(
    actualUser.phoneNumber,
    args.name,
    flowData,
    flowParams,
    formattedText
  );

  if (!flowResult.success) {
    return getResultResponse(
      false,
      flowResult.message || "Hubo un problema al solicitar la programación de la cita.",
      { ...flowResult.count },
    )
  }

  return getResultResponse(
    true,
    flowResult.message || "Solicitud de programación de cita enviada correctamente.",
    { ...flowResult.count },
  );
}

exports.getOrderQuote = async (actualUser, args) => {
  log(`💰 Entrando en getOrderQuote con args: ${JSON.stringify(args, null, 2)}`);

  try {
    const { line_items, delivery_address } = args;

    // Validar que line_items esté presente y sea un array
    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return getResultResponse(
        false,
        "Para generar una cotización, necesito una lista de productos con sus cantidades. Primero busca los productos que necesitas.",
        {},
      );
    }

    // Validar que tenga dirección de entrega
    if (!delivery_address) {
      return getResultResponse(
        false,
        "Para calcular el total con costo de envío, necesito tu dirección de entrega. Puedes compartir tu ubicación o escribir tu dirección.",
        {},
      );
    }

    log(`📋 Generando cotización para ${line_items.length} producto(s) con entrega a: ${delivery_address}`);

    const { processedItems, errorItems, subtotal: calculatedSubtotal } = line_items.reduce((acc, item) => {
      try {
        if (!item.product_name || !item.quantity || !item.price) {
          console.error(`❌ Item inválido en line_items: ${JSON.stringify(item)}. Requiere product_name, quantity y price.`);
          acc.errorItems.push(item);
          return acc;
        }

        const totalPrice = item.price * item.quantity;

        const processedItem = {
          product_name: item.product_name,
          quantity: item.quantity,
          total_price: totalPrice,
          stock_available: item.stock_available || "Disponible"
        };
        acc.processedItems.push(processedItem);
        acc.subtotal += totalPrice;
        return acc;
      } catch (err) {
        console.error(`❌ Error procesando item en line_items: ${err.message}`);
        acc.errorItems.push(item);
        return acc;
      }
    }, { processedItems: [], errorItems: [], subtotal: 0 });

    if (processedItems.length === 0) {
      return getResultResponse(
        false,
        "No se pudieron procesar los productos solicitados. Verifica que tengan product_name, quantity y price válidos.",
        {},
      );
    }

    const deliveryFee = 50;

    const quotationData = {
      line_items: processedItems,
      calculatedSubtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total: calculatedSubtotal + deliveryFee,
      delivery_address: delivery_address,
      currency: "MXN",
      quote_valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      created_at: new Date().toISOString(),

      location_info: {
        address: delivery_address || null,
        latitude: null,
        longitude: null,
        isManualAddress: true
      }
    };

    // Usar la función parseDeliveryAddress para determinar el tipo de ubicación
    let deliveryAddressDisplay = "";

    log(`🔍 getOrderQuote - Analizando delivery_address: "${delivery_address}"`);
    const quoteCoordinates = parseDeliveryAddress(delivery_address);
    log(`🔍 getOrderQuote - Resultado de parseDeliveryAddress: ${JSON.stringify(quoteCoordinates)}`);

    // Verificar si son coordenadas válidas
    if (quoteCoordinates &&
      typeof quoteCoordinates.latitud === 'number' &&
      typeof quoteCoordinates.longitude === 'number' &&
      !isNaN(quoteCoordinates.latitud) &&
      !isNaN(quoteCoordinates.longitude)) {
      deliveryAddressDisplay = "📱 Ubicación obtenida por GPS";
      log(`🗺️ getOrderQuote - Coordenadas válidas detectadas: ${quoteCoordinates.latitud}, ${quoteCoordinates.longitude}`);
    } else {
      // No son coordenadas, mostrar la dirección tal como está
      deliveryAddressDisplay = delivery_address;
      log(`📝 getOrderQuote - Dirección manual: ${delivery_address}`);
    }

    // Construir mensaje para el usuario
    console.log(`🔍 getOrderQuote - Valor final de deliveryAddressDisplay: "${deliveryAddressDisplay}"`);
    const quotationMessage = [
      `🛒 *Cotización de tu pedido:*\n\n`,
      `📦 *Productos:*`,
      ...processedItems.map(
        (item, index) =>
          `${index + 1}. ${item.product_name} - ${item.quantity}\n   Total: $${item.total_price} MXN\n`
      ),
      `\n💰 *Resumen:*`,
      `Subtotal: $${calculatedSubtotal} MXN`,
      `Envío: $${deliveryFee} MXN`,
      `*Total: $${calculatedSubtotal + deliveryFee} MXN*\n\n`,
      `📍 *Dirección de entrega:* ${deliveryAddressDisplay}\n\n`,
      `¿Confirmas tu pedido? Si estás de acuerdo, procederemos con la información de pago.`
    ].join('\n');

    console.log(`🔍 getOrderQuote - Mensaje completo antes de enviar:\n${quotationMessage}`);

    try {
      const mixpanel = Mixpanel.init(MIX_TOKEN, { debug: true });
      mixpanel.track('order_quote_generated', {
        userID: actualUser.uid,
        itemsCount: processedItems.length,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        phoneNumber: actualUser.phoneNumber,
        agent: "CHIKASNAILS"
      });
    } catch (mixpanelError) {
      console.log(`⚠️ Error en tracking Mixpanel: ${mixpanelError.message}`);
    }

    await sendTextAgentMessage(quotationMessage, actualUser.phoneNumber, '', actualUser.uid);

    return getResultResponse(
      true,
      quotationMessage,
      quotationData,
    );
  } catch (error) {
    log(`❌ Error en getOrderQuote: ${error.message}`);

    // Tracking de error con Mixpanel
    try {
      const mixpanel = Mixpanel.init(MIX_TOKEN, { debug: true });
      mixpanel.track('order_quote_error', {
        userID: actualUser.uid,
        error: error.message.substring(0, 200),
        agent: "CHIKASNAILS"
      });
    } catch (mixpanelError) {
      log(`⚠️ Error en tracking Mixpanel: ${mixpanelError.message}`);
    }

    return getResultResponse(
      false,
      "😔 Lo siento, hubo un problema al generar tu cotización. Por favor, intenta nuevamente.",
      null,
    );
  }
};

exports.submitOrder = async (actualUser, args) => {
  const now = moment().tz('America/Mexico_City');
  const finalCustomerName = args.customer_name || actualUser.name || 'Cliente';

  console.log(`💅 Entrando en submitOrder para CHIKASNAILS`);

  try {
    const { customer_name, total_price_quoted, line_items, delivery_address, payment_screenshot_url } = args;

    // Validar que todos los campos requeridos estén presentes
    if (!total_price_quoted || !line_items) {
      return getResultResponse(
        false,
        "❌ Faltan datos requeridos. Necesito el precio cotizado y productos.",
        {}
      );
    }

    // Validar dirección de entrega
    if (!delivery_address) {
      return getResultResponse(
        false,
        "❌ Necesito una dirección de entrega. Por favor proporciona tu dirección o comparte tu ubicación.",
        {}
      );
    }

    if (!payment_screenshot_url) {
      return getResultResponse(
        false,
        "❌ Necesito el comprobante de pago para procesar la orden.",
        {}
      );
    }

    // Validar que line_items sea un array y no esté vacío
    if (!Array.isArray(line_items) || line_items.length === 0) {
      return getResultResponse(
        false,
        "❌ La lista de productos no puede estar vacía. Necesito al menos un producto para procesar la orden.",
        {}
      );
    }

    // Generar ID único para la orden
    const orderId = uuid.v4();

    // Generar número de orden secuencial
    const ordersCollectionRef = firestorePaths.ordersCollection();
    const ordersSnapshot = await ordersCollectionRef.get();
    const orderCount = ordersSnapshot.size;
    const orderNumber = `CHIKASNAILS-${orderCount + 1}`;

    console.log(`📋 Generando orden número: ${orderNumber} (total de órdenes existentes: ${orderCount})`);

    // Crear resumen de productos usando la estructura real
    const productsSummary = line_items
      .map(item => {
        return `${item.product_name} x ${item.quantity}`;
      })
      .join(', ');

    // Calcular información del pedido
    const productCount = line_items.length;

    // Usar parseDeliveryAddress para analizar el delivery_address
    let locationInfo = {
      address: delivery_address,
      latitude: null,
      longitude: null,
      isManualAddress: true
    };

    console.log(`🔍 Analizando delivery_address: "${delivery_address}"`);
    const coordinatesResult = parseDeliveryAddress(delivery_address);
    console.log(`🔍 Resultado de parseDeliveryAddress:`, coordinatesResult);

    // Verificar si son coordenadas válidas
    if (coordinatesResult &&
      typeof coordinatesResult.latitud === 'number' &&
      typeof coordinatesResult.longitude === 'number' &&
      !isNaN(coordinatesResult.latitud) &&
      !isNaN(coordinatesResult.longitude)) {
      // Es una ubicación GPS
      locationInfo = {
        address: delivery_address, // Guardamos el texto original "Coordenadas: lat, lng"
        latitude: coordinatesResult.latitud,
        longitude: coordinatesResult.longitude,
        isManualAddress: false
      };
      console.log(`🗺️ Ubicación GPS detectada: ${coordinatesResult.latitud}, ${coordinatesResult.longitude}`);
    } else {
      // Es una dirección manual
      locationInfo = {
        address: delivery_address,
        latitude: null,
        longitude: null,
        isManualAddress: true
      };
      console.log(`📝 Dirección manual detectada: ${delivery_address}`);
    }

    // Crear objeto de la orden para CHIKASNAILS
    const orderData = {
      id: orderId,
      orderNumber: orderNumber,
      customerName: customer_name || actualUser.name || actualUser.phoneNumber,
      deliveryAddress: delivery_address, // Guardar texto original
      productsSummary: productsSummary,
      totalPriceQuoted: total_price_quoted,
      lineItems: line_items,
      paymentScreenshotUrl: payment_screenshot_url,

      // Información de ubicación simplificada para el flow
      location: locationInfo,

      // Estadísticas del pedido
      productCount: productCount,

      // Información del usuario
      userId: actualUser.uid,
      userPhoneNumber: actualUser.phoneNumber,
      userName: actualUser.name || actualUser.userName || customer_name,

      // Timestamps
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAtString: now.format('YYYY-MM-DD HH:mm:ss'),

      // Estado de la orden
      status: 'pending', // pending, preparing, ready_for_delivery, delivered, cancelled
      priority: 'normal', // normal, high, urgent

      // Fechas estimadas de entrega
      estimatedDeliveryDate: null,
      deliveredAt: null,

      // Notas adicionales
      notes: [],
      adminNotes: '',

      // Información de seguimiento
      isActive: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),

      // Tipo de agente
      agent: "CHIKASNAILS"
    };

    // Log completo del objeto de la orden
    console.log(`📋 =============== OBJETO ORDEN CHIKASNAILS ===============`);
    console.log(`Datos que se guardarán en Firestore:`);
    console.log(JSON.stringify({
      ...orderData,
      createdAt: '[ServerTimestamp]',
      lastUpdated: '[ServerTimestamp]'
    }, null, 2));
    console.log(`📋 =============== FIN OBJETO ORDEN ===============`);

    // Guardar la orden en Firestore
    const orderRef = firestorePaths.orderDoc(orderId);
    await orderRef.set(orderData);

    console.log(`✅ Orden de carnicería creada exitosamente: ${orderNumber} (ID: ${orderId})`);

    // Tracking con Mixpanel si está disponible
    try {
      const mixpanel = Mixpanel.init(MIX_TOKEN, { debug: true });
      mixpanel.track('butcher_order_submitted', {
        userID: actualUser.uid,
        orderNumber: orderNumber,
        customerName: finalCustomerName,
        totalPrice: total_price_quoted,
        productCount: productCount,
        phoneNumber: actualUser.phoneNumber,
        agent: "CHIKASNAILS"
      });
    } catch (mixpanelError) {
      console.log(`⚠️ Error en tracking Mixpanel: ${mixpanelError.message}`);
    }

    // Se envia el flow a los usuarios asignados de b2b desde kai for business
    const flowData = {
      type: `new_chikasnails_order_v1`,
      orderNumber,
      customerName: finalCustomerName,
      productsSummary,
      totalPriceQuoted: total_price_quoted,
      deliveryAddress: delivery_address,
      orderId,
    };
    const flowParams = new URLSearchParams({
      ...flowData,
      userId: actualUser.uid,
      senderPhoneNumber: actualUser.phoneNumber,
    });
    const formattedText = [
      `# 🌟 Nueva Orden CHIKASNAILS`,
      `## ⏰ Fecha y hora`,
      `- ${now.format('YYYY-MM-DD HH:mm:ss')}`,
      `## 🛒 Detalles de la Orden`,
      `- Número de Orden: ${orderNumber}`,
      `- Numero telefónico Cliente: ${actualUser.phoneNumber}`,
      `- Cliente: ${finalCustomerName}`,
      `- Productos: ${productsSummary}`,
      `- Total: $${total_price_quoted} MXN`,
      `- Dirección de Entrega: ${delivery_address}`,
    ];


    const sendFlowResult = await sendFlowsToBusinessUsers(
      actualUser.phoneNumber,
      finalCustomerName,
      flowData,
      flowParams,
      formattedText,
    );

    if (sendFlowResult.success) {
      console.log(`✅ Flows enviados correctamente para orden CHIKASNAILS`);
    } else {
      console.log(`❌ Error enviando flows: ${sendFlowResult.message} - Count: ${JSON.stringify(sendFlowResult.count)}`);
    }

    // Determinar cómo mostrar la dirección de entrega al usuario usando parseDeliveryAddress
    let deliveryAddressDisplay = "";

    console.log(`🔍 Analizando delivery_address para display: "${delivery_address}"`);
    const addressCoordinates = parseDeliveryAddress(delivery_address);
    console.log(`🔍 Resultado de parseDeliveryAddress para display:`, addressCoordinates);

    // Verificar si son coordenadas válidas
    if (addressCoordinates &&
      typeof addressCoordinates.latitud === 'number' &&
      typeof addressCoordinates.longitude === 'number' &&
      !isNaN(addressCoordinates.latitud) &&
      !isNaN(addressCoordinates.longitude)) {
      // Es una ubicación GPS
      deliveryAddressDisplay = "📱 Ubicación obtenida por GPS";
      console.log(`🗺️ Display: Coordenadas válidas detectadas: ${addressCoordinates.latitud}, ${addressCoordinates.longitude}`);
    } else {
      // Es una dirección manual
      deliveryAddressDisplay = delivery_address;
      console.log(`📝 Display: Dirección manual: ${delivery_address}`);
    }

    return getResultResponse(
      true,
      `\
¡Perfecto! Tu pedido ha sido recibido 💅

*Pedido Confirmado*
${finalCustomerName}, tu orden ${orderNumber} está siendo procesada.

📋 *Resumen:*
• ${productCount} producto(s)
• Total: $${total_price_quoted} MXN
• Entrega: ${deliveryAddressDisplay}

Nuestro equipo comenzará a preparar tu pedido y te contactaremos para coordinar la entrega.

¡Gracias por elegir CHIKASNAILS! 🌟`,
      {
        orderId: orderId,
        orderNumber: orderNumber,
        customerName: finalCustomerName,
        deliveryAddress: deliveryAddressDisplay,
        productsSummary: productsSummary,
        totalPriceQuoted: total_price_quoted,
        lineItems: line_items,
        paymentScreenshotUrl: payment_screenshot_url,
        status: 'pending',
        createdAt: orderData.createdAtString,
        productCount: productCount
      }
    );

  } catch (error) {
    console.log(`❌ Error en submitOrder: ${error.message}`);

    // Tracking de error con Mixpanel
    try {
      const mixpanel = Mixpanel.init(MIX_TOKEN, { debug: true });
      mixpanel.track('butcher_order_error', {
        userID: actualUser.uid,
        error: error.message.substring(0, 200),
        agent: "CHIKASNAILS"
      });
    } catch (mixpanelError) {
      console.log(`⚠️ Error en tracking Mixpanel: ${mixpanelError.message}`);
    }

    return getResultResponse(
      false,
      "😔 Lo siento, hubo un problema al procesar tu orden. Por favor, intenta nuevamente en unos minutos.",
      {}
    );
  }
};

exports.getPaymentInfo = async (actualUser, args) => {
  log(`💳 Entrando en getPaymentInfo con args: ${JSON.stringify(args, null, 2)}`);

  try {
    const { total_amount, customer_name } = args;

    // Validar que el monto esté presente
    if (!total_amount || total_amount <= 0) {
      return getResultResponse(
        false,
        "❌ Error: Se requiere un monto válido para mostrar la información de pago.",
        {}
      );
    }

    // Obtener datos bancarios de la colección payment_config
    let bankInfo = null;
    try {
      const paymentConfigCollectionRef = firestorePaths.paymentConfigCollection();
      const paymentConfigRef = paymentConfigCollectionRef.doc("Thb588jSoKu6nGOSZJRx");
      const paymentConfigDoc = await paymentConfigRef.get();

      if (paymentConfigDoc.exists) {
        const paymentData = paymentConfigDoc.data();

        bankInfo = {
          bankName: paymentData.bankName,
          accountNumber: paymentData.accountNumber,
          cardNumber: paymentData.cardNumber,
          clabe: paymentData.clabe,
          beneficiaryName: paymentData.beneficiaryName,
          rfc: paymentData.rfc,
          concept: `${paymentData.conceptPrefix || "Orden CHIKASNAILS"} - ${customer_name || 'Cliente'}`,
          amount: total_amount,
          additionalInstructions: paymentData.additionalInstructions || ""
        };
      } else {
        console.warn(`⚠️ No se encontró configuración de pago, usando datos por defecto`);
        // Datos por defecto como fallback para CHIKASNAILS
        bankInfo = {
          bankName: "BBVA México",
          accountNumber: "150 393 4805",
          cardNumber: "4152 3144 8394 3752",
          clabe: "0129 1001 5039 3480",
          beneficiaryName: "CHIKASNAILS",
          rfc: "CAF123456789",
          concept: `Orden CHIKASNAILS - ${customer_name || 'Cliente'}`,
          amount: total_amount,
          additionalInstructions: ""
        };
      }
    } catch (firestoreError) {
      log(`❌ Error obteniendo datos bancarios de Firestore: ${firestoreError.message}`);
      // Usar datos por defecto en caso de error para CHIKASNAILS
      bankInfo = {
        bankName: "BBVA México",
        accountNumber: "150 393 4805",
        cardNumber: "4152 3144 8394 3752",
        clabe: "0129 1001 5039 3480 55",
        beneficiaryName: "CHIKASNAILS CARNICERÍA",
        rfc: "CAF123456789",
        concept: `Orden CHIKASNAILS - ${customer_name || 'Cliente'}`,
        amount: total_amount,
        additionalInstructions: ""
      };
    }

    // Formatear el mensaje con los datos bancarios para CHIKASNAILS
    let paymentMessage = `¡Gracias por tu confianza, ${customer_name || 'Cliente'}!

Te compartimos los datos para realizar tu pago:

👤 **Beneficiario:** ${bankInfo.beneficiaryName}
💳 **Tarjeta:** ${bankInfo.cardNumber}
🏦 **Cuenta:** ${bankInfo.accountNumber}
🔢 **CLABE:** ${bankInfo.clabe}

💬 **Concepto de transferencia:**
${bankInfo.concept}`;

    // Agregar instrucciones adicionales si existen
    if (bankInfo.additionalInstructions && bankInfo.additionalInstructions.trim() !== '') {
      paymentMessage += `\n\n📝 **Instrucciones adicionales:**\n${bankInfo.additionalInstructions}`;
    }

    paymentMessage += `\n\nUna vez realizado el pago, por favor envía tu comprobante por aquí.`;

    log(`✅ Información de pago generada para monto: $${total_amount}`);
    return getResultResponse(
      true,
      "✅ Información de pago generada correctamente.",
      {
        bankInfo: bankInfo,
        totalAmount: total_amount,
        customerName: customer_name,
        status: 'waiting_for_payment_proof'
      }
    );

  } catch (error) {
    log(`❌ Error en getPaymentInfo: ${error.message}`);

    return getResultResponse(
      false,
      "❌ Error al generar la información de pago. Por favor intenta nuevamente.",
      {}
    );
  }
};

exports.searchProducts = async (actualUser, args) => {
  try {
    const { query } = args;

    // Validar que la consulta esté presente
    if (!query || query.trim() === '') {
      console.warn(`⚠️ Consulta vacía en searchProducts`);

      return getResultResponse(
        false,
        "Para buscar productos, necesito que me describas qué tipo de carne o producto necesitas.",
        "No se encontraron productos para mostrar."
      );
    }

    console.log(`🔍 Búsqueda de productos iniciada para consulta: "${query}"`);

    // Obtener URL del Google Sheets desde Firestore
    let sheetsUrl = null;
    try {
      const productsSheetsRef = firestorePaths.sheetsCollection().doc("products");
      const productsSheetsDoc = await productsSheetsRef.get();

      if (productsSheetsDoc.exists) {
        const sheetsData = productsSheetsDoc.data();
        sheetsUrl = sheetsData.url || sheetsData.sheets_url;
        console.log(`✅ URL del Google Sheets obtenida: ${sheetsUrl}`);
      } else {
        console.error(`❌ No se encontró configuración de productos sheets`);

        return getResultResponse(
          false,
          "😔 Lo siento, no puedo acceder al catálogo de productos en este momento.",
          "Catálogo de productos no disponible."
        );
      }
    } catch (firestoreError) {
      console.error(`❌ Error obteniendo URL de Google Sheets: ${firestoreError.message}`);

      return getResultResponse(
        false,
        "😔 Hubo un problema al acceder al catálogo. Por favor, intenta nuevamente.",
        "Error accediendo al catálogo de productos."
      );
    }

    // Inicializar Gemini
    if (!GEMINI_API_KEY) {
      console.error(`❌ GEMINI_API_KEY no configurada`);

      return getResultResponse(
        false,
        "😔 Configuración de búsqueda no disponible.",
        "Configuración de búsqueda no disponible."
      );
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const { formattedDate } = getDate("America/Mexico_City");

    // NUEVO PROMPT: Lista formateada directamente para el agente
    let resultTextSearchPrompt =
      `\
Eres un asistente especializado en búsqueda de productos. Tu tarea es buscar en la base de datos y generar un catálogo formateado.

USER QUERY: ${query}

La base de datos de productos está en el siguiente Google Sheets:
URL: ${sheetsUrl}
Si no puedes acceder al Google Sheets, responde que no puedes realizar la búsqueda.

===== TU MISIÓN =====

1. ANALIZAR LA CONSULTA
   - Identifica qué busca el usuario
   - Genera términos relacionados, sinónimos y variaciones

2. BUSCAR EN LA BASE DE DATOS
   - Busca productos que contengan CUALQUIERA de los términos relacionados
   - Incluye productos de la misma familia o categoría
   - CRITERIO INCLUSIVO: Si hay duda sobre si incluir un producto, INCLÚYELO
   - Ordena por relevancia (más específicos a la consulta primero)

3. GENERAR EL CATÁLOGO
    - Formatea el catálogo en una lista clara y legible
    - Incluye para cada producto:
      • Nombre del producto
      • Descripción breve (1-2 líneas)
      • Precio en MXN
      • Disponibilidad de stock (si está disponible)
      • Otra información relevante que ayude al usuario
    - Si no hay productos que coincidan, responde que no se encontraron productos

4. RESPONDER AL USUARIO
   - Proporciona el catálogo generado
   - Si no se encontraron productos, sugiere al usuario que intente con otros términos

===== REGLAS IMPORTANTES =====

- Usa un lenguaje claro y amigable
- Sé conciso y directo
- Evita respuestas largas o complicadas
- No incluyas información irrelevante
- Si no puedes acceder al Google Sheets, informa al usuario que no puedes realizar la búsqueda
- Responde en español
- Nunca inventes información o productos que no existen en la base de datos

===== NOTAS =====
- El formato proporcionado por la base de datos comunmente es CSV exportado de Google Sheets, HTML o JS. Si tienes algun problema entendiendo el formato, por favor indicalo en tu respuesta. Pero haz lo posible por extraer la información relevante, o cumplir con la misión de la query del usuario.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: resultTextSearchPrompt }] }],
      config: {
        systemInstruction: [{ text: `*Current Date:* Today is ${formattedDate}.` }],
        tools: [{ urlContext: {} }],
      },
    });

    const geminiResponse = result.text || "Lo siento, no pude realizar la búsqueda de productos en este momento.";

    console.log(`📄 Respuesta de Gemini: ${geminiResponse}...`);

    return getResultResponse(
      true,
      "✅ Búsqueda de productos realizada correctamente.",
      geminiResponse,
      undefined,
      undefined,
      "json"
    );
  } catch (error) {
    console.error(`❌ Error en searchProducts: ${error.message}`);

    return getResultResponse(
      false,
      "😔 Lo siento, hubo un problema al buscar productos. Por favor, intenta nuevamente.",
      `\
Error en la búsqueda de productos. 

Puedes intentar:
• Buscar tipos de carne específicos
• Preguntar por productos populares
• Consultar sobre productos procesados

Por favor, intenta tu búsqueda nuevamente.`
    );
  }
};

/* eslint-enable */
