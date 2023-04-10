import openaiHandler from "https://deno.land/x/openai_handler@0.0.2/mod.ts";
import type { Config } from "https://edge.netlify.com";

import type { Image } from "../../src/interfaces";

const defaultParams: Image = {
  prompt: "A goldfish playing the saxophone",
  n: 1,
  size: "256x256",
  response_format: "b64_json",
};

export default async (req: Request) => {
  const userParams: Image = await req.json();

  return await openaiHandler("/v1/images/generations", {
    ...defaultParams,
    ...userParams,
  });
};

export const config: Config = {
  path: "/api/openai/image",
};
