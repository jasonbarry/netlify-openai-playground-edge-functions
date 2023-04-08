import openaiHandler from "https://deno.land/x/openai_handler/mod.ts";
import type { Edit } from "../../src/interfaces";

const endpoint = "/v1/edits";

const defaultParams: Edit = {
  model: "text-davinci-edit-001",
  input: "Hello!",
  instruction: "Translate into French.",
};

export default async (req: Request) => {
  const text = await req.text();
  const userParams: Edit = JSON.parse(text);
  const bodyParams = { ...defaultParams, ...userParams, stream: true };

  return await openaiHandler(endpoint, bodyParams);
};
