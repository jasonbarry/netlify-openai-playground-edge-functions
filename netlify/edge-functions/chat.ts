import type { Config, Context } from "netlify:edge";

interface Params {
  model?: "gpt-4" | "gpt-3.5-turbo";
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export default async (req: Request, context: Context) => {
  const text = await req.text();
  const params: Params = JSON.parse(text);

  const API_URL = "https://api.openai.com/v1/chat/completions";
  // @ts-expect-error
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  const bodyParams: Params = {
    model: params.model || "gpt-3.5-turbo",
    messages: params.messages,
    max_tokens: params.max_tokens || 256,
    temperature: params.temperature || 0.7,
    top_p: params.top_p || 1,
    frequency_penalty: params.frequency_penalty || 0,
    presence_penalty: params.presence_penalty || 0,
    stream: params.stream ?? true,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(bodyParams),
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
