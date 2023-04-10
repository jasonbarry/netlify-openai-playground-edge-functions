import { getTextFromPayload } from "./text";

// Read and process the stream data
export const readStream = async (
  response: Response,
  callback: React.Dispatch<React.SetStateAction<string>>
) => {
  // @ts-expect-error
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  async function read() {
    const { done, value } = await reader.read();
    if (done) {
      return;
    }
    const valueText = decoder.decode(value);

    const chunks = valueText.split(/^data: |\ndata: /).slice(1);
    for (const chunk of chunks) {
      try {
        console.log(chunk);
        const json = JSON.parse(chunk);
        const text = getTextFromPayload(json);
        if (text) {
          callback((message: string) => `${message}${text}`);
        }
      } catch (err) {
        console.warn("Regex could not match streamed response.", err);
      }
    }

    read();
  }

  read();
};
