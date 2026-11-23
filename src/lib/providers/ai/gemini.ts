import { GoogleGenAI } from "@google/genai";
import { IAIProvider, AIGenerateOptions, AIGenerateResponse } from "./types";

export class GeminiAIProvider implements IAIProvider {
  name = "gemini";

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  async generateText(options: AIGenerateOptions): Promise<AIGenerateResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return {
        provider: this.name,
        model: modelName,
        text: "",
        isConfigured: false,
        error:
          "Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local to enable AI-powered research synthesis and script generation.",
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const contents = options.systemPrompt
        ? `${options.systemPrompt}\n\nTask:\n${options.prompt}`
        : options.prompt;

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 4000,
          responseMimeType: options.jsonMode ? "application/json" : "text/plain",
        },
      });

      const responseText = response.text || "";

      return {
        provider: this.name,
        model: modelName,
        text: responseText,
        isConfigured: true,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        provider: this.name,
        model: modelName,
        text: "",
        isConfigured: true,
        error: `Gemini API invocation failed: ${msg}`,
      };
    }
  }
}
