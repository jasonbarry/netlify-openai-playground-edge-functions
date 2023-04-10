import openaiHandler from "https://deno.land/x/openai_handler@0.0.2/mod.ts";
import type { Config } from "https://edge.netlify.com";

import type { Edit } from "../../src/interfaces";

const defaultParams: Edit = {
  model: "text-davinci-edit-001",
  input: "Thank you very much!",
  instruction: "Translate to French.",
};

export default async (req: Request) => {
  const userParams: Edit = await req.json();

  return await openaiHandler("/v1/edits", { ...defaultParams, ...userParams });
};

export const config: Config = {
  path: "/api/openai/edit",
};
