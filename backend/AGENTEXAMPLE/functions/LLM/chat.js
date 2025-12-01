/* eslint-disable */
const { VertexAI } = require('@google-cloud/vertexai');
const { getSystemInstruction } = require('./prompt');
const { getMessagesChat } = require("../support/chatAgentSupport");
const { functionDeclarations } = require('./declarations');

const vertexAiClient = new VertexAI({ project: 'asistente-comercial-8d43c', location: 'us-central1' });

const model = 'gemini-2.5-flash';

exports.initVertexAiChat = async (actualUser) => {
  const systemPrompt = await getSystemInstruction(actualUser);

  const generativeModel = vertexAiClient.preview.getGenerativeModel({
    model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.05,
      topP: 0.85,
      //'topK': 64,
      //responseMimeType: "application/json",
    },
    tools: functionDeclarations,
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  });

  const messagesParts = await getMessagesChat(actualUser);

  let chat;
  try {
    chat = generativeModel.startChat({
      history: messagesParts,
    });
  } catch (err) {
    console.error('Error starting chat with Vertex AI:', err);
    throw err;
  }

  return {
    sendMessage: async (userPrompt) => {
      try {
        if (!userPrompt) throw new Error('User prompt is empty');

        const response = await chat.sendMessage(userPrompt);
        return response;
      } catch (err) {
        console.error('Error sending message to Vertex AI:', err);
        throw err;
      }
    }
  }
};
/* eslint-enable */
