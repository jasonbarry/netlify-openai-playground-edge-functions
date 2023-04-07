export type Role = "system" | "user" | "assistant";
export type ChatModel = "gpt-4" | "gpt-3.5-turbo";

export interface ChatRequestBody {
  model: ChatModel;
  messages: Array<{
    role: Role;
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}
