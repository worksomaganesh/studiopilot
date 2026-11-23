export interface AIGenerateOptions {
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  responseSchema?: Record<string, unknown>;
  jsonMode?: boolean;
}

export interface AIGenerateResponse {
  provider: string;
  model: string;
  text: string;
  isConfigured: boolean;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
  };
}

export interface IAIProvider {
  name: string;
  isConfigured(): boolean;
  generateText(options: AIGenerateOptions): Promise<AIGenerateResponse>;
}
