import openaiHandler from "https://deno.land/x/openai_handler@0.0.2/mod.ts";
import type { Config } from "https://edge.netlify.com";

import type { Chat } from "../../src/interfaces";

const defaultParams: Chat = {
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" },
  ],
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stream: true,
};

export default async (req: Request) => {
  const userParams: Chat = await req.json();

  return await openaiHandler("/v1/chat/completions", {
    ...defaultParams,
    ...userParams,
  });
};

export const config: Config = {
  path: "/api/openai/chat",
};
