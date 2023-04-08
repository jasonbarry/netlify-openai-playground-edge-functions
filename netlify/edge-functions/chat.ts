import openaiHandler from "https://deno.land/x/openai_handler/mod.ts";
import type { Chat } from "../../src/interfaces";

const endpoint = "/v1/chat/completions";

const defaultParams: Chat = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello!" }],
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export default async (req: Request) => {
  const text = await req.text();
  const userParams: Chat = JSON.parse(text);
  const bodyParams = { ...defaultParams, ...userParams, stream: true };

  return await openaiHandler(endpoint, bodyParams);
};
