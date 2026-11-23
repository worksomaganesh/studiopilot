import { IAIProvider } from "./types";
import { GeminiAIProvider } from "./gemini";

export * from "./types";

export function getAIProvider(): IAIProvider {
  return new GeminiAIProvider();
}
