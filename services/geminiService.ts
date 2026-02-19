
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

export const sendMessageToGemini = async (history: Message[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Convert our simple history to the format Gemini expects if needed, 
  // but for generateContent we can just send the last message or a prompt.
  // We'll use the last user message + context for simplicity in this version.
  
  const lastUserMessage = history[history.length - 1].text;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: lastUserMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Desculpe, não consegui processar sua resposta agora.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao tentar falar com o assistente. Verifique sua conexão ou tente novamente mais tarde.";
  }
};
