export type Model = {
  Complete:
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
}

export interface Complete extends BaseRequestBody {
  model: Model["Complete"];
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

export interface Edit
  extends Omit<
    BaseRequestBody,
    "max_tokens" | "frequency_penalty" | "presence_penalty"
  > {
  model: Model["Edit"];
  input: string;
  instruction: string;
}
