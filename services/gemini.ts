
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "../constants";
import { Message, Language } from "../types";

export const generateOrientAiResponse = async (userMessage: string, history: Message[], lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert our message format to Gemini's history format
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add current message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction: getSystemPrompt(lang),
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "Desculpe, não consegui processar sua resposta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com o serviço OrientAi. Por favor, tente novamente mais tarde.";
  }
};
