
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getRockWisdom(rockName: string, level: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a wise and punny pet rock named ${rockName}. You are currently at level ${level}. Give a short, 1-sentence funny or philosophical piece of "rock wisdom" to your owner. Keep it under 15 words. Mention something about being a rock.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text || "I'm feeling solid today.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Stay grounded, my friend.";
  }
}
