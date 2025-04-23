import { GoogleGenAI } from "@google/genai";
import { APP_CONFIG } from "@/config/config";

// Initialize the Google Generative AI API
const genAI = new GoogleGenAI({ apiKey: APP_CONFIG.GOOGLE_AI_API_KEY });

// Function to generate AI response
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // For text-only input, use the gemini-2.0-flash-001 model
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    // Ensure we handle the response structure correctly
    if (response && response.text) {
      return response.text;
    } else {
      console.warn("Unexpected response format from Google AI API:", response);
      return "I received your message, but I'm having trouble formulating a response right now.";
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm having trouble generating a response right now. Please try again later.";
  }
}
