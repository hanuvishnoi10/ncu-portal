import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (userPrompt: string, contextData: string): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, but the AI service is currently unavailable (Missing API Key).";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are "NCU Bot", a helpful and friendly AI assistant for The NorthCap University student portal. 
    You have access to the following context about the student:
    ${contextData}
    
    Answer the student's questions based on this data. If they ask about their schedule, grades, or fees, look up the information in the context.
    If the question is general (e.g., "How to study effectively?"), provide general advice.
    Keep answers concise, professional, and encouraging.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};