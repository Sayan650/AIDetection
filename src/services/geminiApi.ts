import { GoogleGenAI } from '@google/genai';
import * as FileSystem from 'expo-file-system';
import { DiagnosisResponse } from './mockApi';

export interface ImageData {
  uri: string;
  type: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  base64?: string;
}

class GeminiApiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('EXPO_PUBLIC_GEMINI_API_KEY is not defined in .env');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Identifies disease from image using Gemini API
   * @param imageData - The image data to analyze
   * @returns Promise with diagnosis response
   */
  async detectDisease(imageData: ImageData): Promise<DiagnosisResponse> {
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      throw new Error(JSON.stringify({ 
        code: "CONFIG_ERROR", 
        message: "Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your environment variables." 
      }));
    }

    try {
      // Read image as base64 if not already provided
      let base64Data = imageData.base64;
      if (!base64Data) {
        if (!imageData.uri) {
          throw new Error(JSON.stringify({ code: "INVALID_IMAGE", message: "Image URI is required" }));
        }
        base64Data = await FileSystem.readAsStringAsync(imageData.uri, {
          encoding: 'base64',
        });
      }

      const prompt = `You are a dermatology expert AI. Analyze the uploaded image of skin disease carefully.
Provide your response strictly in the following JSON format:
{
  "disease": "Name of the detected disease, or 'Healthy Skin'",
  "confidence": <a number between 0 and 1 indicating your confidence>,
  "recommendations": [
     "recommendation 1",
     "recommendation 2",
     "..."
  ]
}
If the image does not appear to be human skin, respond with:
{
  "disease": "Not a valid skin image",
  "confidence": 0,
  "recommendations": ["Please upload a clear image of a skin condition."]
}
Avoid markdown outside the JSON. Return valid JSON only.`;

      const contents = [
        {
          inlineData: {
            mimeType: imageData.type || 'image/jpeg',
            data: base64Data,
          },
        },
        { text: prompt },
      ];

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
      });
      let text = response.text || "";

      // Clean Markdown formatting from the JSON response
      if (text.startsWith("\`\`\`json")) {
        text = text.substring(7);
      } else if (text.startsWith("\`\`\`")) {
        text = text.substring(3);
      }
      if (text.endsWith("\`\`\`")) {
        text = text.substring(0, text.length - 3);
      }

      const parsedData = JSON.parse(text.trim());

      return {
        disease: parsedData.disease || "Unknown",
        confidence: parsedData.confidence || 0,
        recommendations: parsedData.recommendations || ["Seek professional medical advice"],
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(JSON.stringify({
        code: "SERVER_ERROR",
        message: "Failed to analyze image",
        details: error.message
      }));
    }
  }
}

export const geminiApiService = new GeminiApiService();
