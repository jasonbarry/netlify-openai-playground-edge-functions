// @ts-expect-error
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

export default async function openaiHandler(endpoint: string, params) {
  const url = `https://api.openai.com${endpoint}`;
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };

  console.log("calling OpenAI API: " + JSON.stringify(params));

  try {
    const res = await fetch(url, requestOptions);

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
}
