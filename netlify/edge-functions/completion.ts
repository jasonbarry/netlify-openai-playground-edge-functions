import openaiHandler from "https://deno.land/x/openai_handler@0.0.2/mod.ts";
import type { Config } from "https://edge.netlify.com";

import type { Completion } from "../../src/interfaces";

const defaultParams: Completion = {
  model: "text-davinci-003",
  prompt: "Write a tagline for an ice cream shop. ",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stream: true,
};

export default async (req: Request) => {
  const userParams: Completion = await req.json();

  return await openaiHandler("/v1/completions", {
    ...defaultParams,
    ...userParams,
  });
};

export const config: Config = {
  path: "/api/openai/completion",
};
