export type Model = {
  Completion:
    | "ada"
    | "babbage"
    | "chat-davinci-003-alpha"
    | "curie"
    | "curie-instruct-beta"
    | "davinci"
    | "davinci-instruct-beta"
    | "text-ada-001"
    | "text-babbage-001"
    | "text-curie-001"
    | "text-davinci-001"
    | "text-davinci-002"
    | "text-davinci-003";
  Chat: "gpt-4" | "gpt-3.5-turbo";
  Edit: "text-davinci-edit-001" | "code-davinci-edit-001";
};

export type Role = "system" | "user" | "assistant";

export interface BaseRequestBody {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
  user?: string;
}

export interface Completion extends BaseRequestBody {
  model: Model["Completion"];
  prompt: string;
  suffix?: string;
}

export interface Chat extends Omit<BaseRequestBody, "stop"> {
  model: Model["Chat"];
  messages: Array<{
    role: Role;
    content: string;
  }>;
}

export interface Edit {
  input: string;
  instruction: string;
  model: Model["Edit"];
  temperature?: number;
  top_p?: number;
  user?: string;
}

export interface Image {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  n?: number;
  response_format?: "b64_json" | "url";
  user?: string;
}
