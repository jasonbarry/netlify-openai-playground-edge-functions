import type { Config, Context } from "netlify:edge";

import type { ChatRequestBody } from "../../src/interfaces";

export default async (req: Request, context: Context) => {
  const text = await req.text();
  const params: ChatRequestBody = JSON.parse(text);

  const API_URL = "https://api.openai.com/v1/chat/completions";
  // @ts-expect-error
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  const bodyParams: ChatRequestBody = {
    model: params.model || "gpt-3.5-turbo",
    messages: params.messages,
    max_tokens: params.max_tokens || 256,
    temperature: params.temperature || 0.7,
    top_p: params.top_p || 1,
    frequency_penalty: params.frequency_penalty || 0,
    presence_penalty: params.presence_penalty || 0,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ ...bodyParams, stream: true }),
  };

  console.log("calling OpenAI API: " + JSON.stringify(bodyParams));

  try {
    const res = await fetch(API_URL, requestOptions);

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(
        `OpenAI API Error: ${res.status} ${res.statusText} - ${errorMessage}`
      );
      throw new Error(`OpenAI API Error: ${res.status} ${res.statusText}`);
    }

    console.log("Response back from OpenAI", res.body);

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error while processing request:", error);
    return new Response(error.message || "Internal server error", {
      status: 500,
    });
  }
};
