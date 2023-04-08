import openaiHandler from "https://deno.land/x/openai_handler/mod.ts";
import type { Complete } from "../../src/interfaces";

const endpoint = "/v1/completions";

const defaultParams: Complete = {
  model: "text-davinci-003",
  prompt: "hello",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export default async (req: Request) => {
  const text = await req.text();
  const userParams: Complete = JSON.parse(text);
  const bodyParams = { ...defaultParams, ...userParams, stream: true };

  return await openaiHandler(endpoint, bodyParams);
};
