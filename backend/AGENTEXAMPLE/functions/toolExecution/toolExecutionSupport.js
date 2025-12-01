/* eslint-disable */
const axios = require("axios");
const admin = require("firebase-admin");
const uuid = require("uuid");
const { VertexAI } = require("@google-cloud/vertexai");
// const Mixpanel = require("mixpanel");
const { log, error } = require("firebase-functions/logger");
const { user } = require("firebase-functions/v1/auth");
const moment = require("moment-timezone");
const { firestorePaths } = require('../config');

/**
 * @param {boolean} success 
 * @param {string} message 
 * @param {*} result
 * @param {string|undefined} mediaMimeType 
 * @param {string|undefined} mediaUrl
 * @returns
 */
exports.getResultResponse = (
  success,
  message,
  result,
  mediaMimeType = null,
  mediaUrl = null,
  typeToSend = "string"
) => {
  const resultResponse = {
    success,
    message,
    result: typeToSend === "string" ? JSON.stringify(result) : result,
    mediaMimeType,
    mediaUrl,
  };
  const cleanedResult = Object.fromEntries(
    Object.entries(resultResponse).filter(([_, v]) => v != null)
  );
  return cleanedResult;
};

exports.processknowledgeBasePrompt = async (actualUser, args) => {
  const vertex_ai = new VertexAI({
    project: "asistente-comercial-8d43c",
    location: "us-central1",
  });

  const model = "gemini-2.5-flash";

  const date = new Date();
  const dayName = date.toLocaleString("en-US", {
    weekday: "long",
    timeZone: "America/Mexico_City",
  });
  const day = date.toLocaleString("en-US", {
    day: "numeric",
    timeZone: "America/Mexico_City",
  });
  const month = date.toLocaleString("en-US", {
    month: "numeric",
    timeZone: "America/Mexico_City",
  });
  const year = date.toLocaleString("en-US", {
    year: "numeric",
    timeZone: "America/Mexico_City",
  });
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "America/Mexico_City",
  });

  // Formateamos la fecha manualmente en el orden que necesitas
  const currentDate = `${dayName} ${day}/${month}/${year}`;

  const systemPrompt = `
      You are an expert, friendly, and highly efficient customer service assistant. Your purpose is to answer user queries as helpfully and comprehensively as possible.
    
    Your rules are as follows:
    
    1.  **Source of Truth**: You will be provided with a 'user_query' and a 'knowledge_base' in JSON format. Your ONLY source of information is the provided 'knowledge_base'. Do not invent information that is not present.
    
    2.  **Synthesis and Combination**: Your primary skill is to synthesize information from MULTIPLE entries in the knowledge base to create a comprehensive response. If the user's question touches on various topics (e.g., hours and services), you must combine the relevant information from all pertinent entries into a single, fluid, and natural response.
    
    3.  **Intelligent Multimedia Selection**: You can and should attach multimedia content (images or videos) if you believe it enriches the response. You have the freedom to use the text from one entry and the multimedia content from ANOTHER entry if the combination is more helpful to the user. For instance, if asked about services, you might use the text from the "Company Services" entry and the video from the "Corporate Video" entry.
    
    4.  **Strict Output Format**: Your response MUST be only a valid JSON object, with no additional text before or after it. Do not write "Here is the JSON:", just the JSON itself.
    
    5.  **Handling Uncertainty**: If the 'knowledge_base' does not contain the necessary information to answer the 'user_query', state this politely in the 'responseText' field and set the 'multimedia_url' and 'multimedia_type' fields to 'null'.
    
    ### Structured Output Format
    
    The model must always return a JSON object with the following structure. This ensures that your system can consistently parse the response.
    
    **Example of Model Output JSON (based on the provided query):**
    '''json
    {
      "responseText": "Hello. Our services include consulting, software development, and specialized technical support. Our hours of operation are Monday to Friday from 9:00 AM to 6:00 PM, but please note that we are closed on weekends. I'm sharing a video where you can see more about what we do!",
      "multimedia_type": "video",
      "multimedia_url": "https://example.com/videos/servicios.mp4",
      "multimedia_name": "servicios.mp4",
      "multimedia_mime_type": "video/mp4",
      "source_ids": [1, 2, 3, 4]
    }
    
    Definition of Output Fields:
    
    responseText (string): The final, synthesized text message for the user, written in a natural and conversational tone.
    
    multimedia_type (string | null): The type of multimedia content. Can be "image", "video", "document", or null if no media is attached.
    
    multimedia_url (string | null): The full URL of the multimedia file, or null.

    multimedia_name (string | null): The name of the multimedia file (e.g., "document.pdf", "image.jpg", "video.mp4"). This field is REQUIRED when multimedia_type is "document", and optional for other types. Set to null if no multimedia is attached.

    multimedia_mime_type (string | null): The MIME type of the multimedia file (e.g., "application/pdf", "image/jpeg", "video/mp4"). This field is REQUIRED when multimedia_type is "document", and optional for other types. Set to null if no multimedia is attached.
    
    source_ids (array of numbers/strings): An array containing the ids of the knowledge base entries the model used to generate the response. This field is optional but highly recommended for debugging, analysis, and traceability.
    
    Example of Input JSON for the Model:
    
    {
      "user_query": "What services do you offer and what are your hours on weekends?",
      "knowledge_base": [
        {
          "id": 1,
          "title": "Company Services",
          "description": "The company provides consulting, software development, and specialized technical support services.",
          "multimedia_type": "video",
          "multimedia_name": "servicios.mp4",
          "multimedia_mime_type": "video/mp4",
          "multimedia_url": "https://example.com/videos/servicios.mp4"
        },
        {
          "id": 2,
          "title": "Hours of Operation",
          "description": "Our hours of operation are Monday to Friday, from 9:00 AM to 6:00 PM.",
          "multimedia_type": null,
          "multimedia_url": null,
          "multimedia_name": null,
          "multimedia_mime_type": null
        },
        {
          "id": 3,
          "title": "Weekend Availability",
          "description": "We do not operate on weekends or public holidays.",
          "multimedia_type": null,
          "multimedia_url": null,
          "multimedia_name": null,
          "multimedia_mime_type": null
        },
        {
          "id": 4,
          "title": "Corporate Video",
          "description": "A video that provides a summary of all our services.",
          "multimedia_type": "video",
          "multimedia_name": "servicios.mp4",
          "multimedia_mime_type": "video/mp4",
          "multimedia_url": "https://example.com/videos/servicios.mp4"
        }
      ]
    }

    **Example with Document/PDF:**
    
    User Query: "I need the technical documentation"
    
    Model Output:
    '''json
    {
      "responseText": "Of course! I'm sharing our complete technical documentation guide with you.",
      "multimedia_type": "document",
      "multimedia_url": "https://example.com/docs/technical_guide.pdf",
      "multimedia_name": "technical_guide.pdf",
      "multimedia_mime_type": "application/pdf",
      "source_ids": [5]
    }
    '''

    **Example with Video:**
    
    User Query: "How do I connect to my control panel?"
    
    Model Output:
    '''json
    {
      "responseText": "Here's a detailed video showing you how to connect to your control panel step by step.",
      "multimedia_type": "video",
      "multimedia_url": "https://example.com/videos/panel_tutorial.mp4",
      "multimedia_name": "panel_tutorial.mp4",
      "multimedia_mime_type": "video/mp4",
      "source_ids": [6]
    }
    '''
    
    **Important Notes:**
    - When selecting multimedia from the knowledge base, you MUST copy the exact values of multimedia_name and multimedia_mime_type from the source entry.
    - If multimedia_type is "document" or "video", both multimedia_name and multimedia_mime_type are REQUIRED.
    - For "image" type, multimedia_name and multimedia_mime_type are optional (can be null).
    - If no multimedia is attached, set multimedia_type, multimedia_url, multimedia_name, and multimedia_mime_type to null.
    
    `;

  try {
    const generativeModel = vertex_ai.getGenerativeModel({
      model,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0,
        topP: 0.85,
        responseMimeType: "application/json",
        // responseSchema: {
        //   type: "object",
        //   properties: {
        //     responseText: { type: "string" },
        //     multimedia_type: { type: ["string", "null"] },
        //     multimedia_url: { type: ["string", "null"] },
        //     source_ids: { type: "array", items: { type: ["string", "number"] } }
        //   },
        //   required: ["responseText", "multimedia_type", "multimedia_url"]
        // },
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    });

    // Obtener datos de entrada
    const userQuery = args.user_query;
    const knowledgeBase = args.knowledge_base;

    if (!userQuery || !knowledgeBase) {
      throw new Error("Missing required parameters: user_query and knowledge_base");
    }

    const inputData = {
      user_query: userQuery,
      knowledge_base: knowledgeBase
    };

    const textPart = {
      text: JSON.stringify(inputData),
    };

    const request = {
      contents: [
        {
          role: "user",
          parts: [textPart],
        },
      ],
    };

    log(`Processing knowledge base query: ${userQuery}`);
    log(`Knowledge base entries: ${knowledgeBase.length}`);

    const result = await generativeModel.generateContent(request);
    const raw = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    log(`Respuesta del modelo: ${raw}`);

    if (!raw) throw new Error("Respuesta vacía del modelo");

    const jsonParsed = JSON.parse(raw);
    return { success: true, data: jsonParsed };
  } catch (error) {
    let completeError = error.stack;
    log(`Error en processknowledgeBasePrompt: ${error.message}`);
    log(`Complete error: ${completeError}`);
    throw new Error(`Error en processknowledgeBasePrompt: ${error.message}`);
  }
};

exports.parseDeliveryAddress = (query) => {
  try {
    // Esta regex busca: "Coordenadas: ", luego captura un número (incluyendo el - y el .),
    // luego una coma y un espacio, y luego captura el segundo número.
    const regex = /Coordenadas: (-?\d+\.\d+), (-?\d+\.\d+)/;

    // El método .match() lanzará un error si 'query' es null o undefined
    const match = query.match(regex);

    if (match) {
      // match[1] es la primera captura (latitud)
      // match[2] es la segunda captura (longitud)
      const latitud = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return { latitud, longitude };
    }

    // Si el 'query' es válido pero no coincide con el formato, 
    // match será null y devolvemos null.
    return null;
  } catch (error) {
    // Si ocurre cualquier error (ej. 'query' no es un string),
    // la ejecución salta a este bloque y retorna null.
    console.error("Error al procesar el query:", error.message); // Opcional: para depuración
    return null;
  }
}

/* eslint-enable */
