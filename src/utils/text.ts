export const getTextFromPayload = (payload: any): string => {
  const firstChoice = payload.choices[0];
  let content = "";
  if (payload.object === "text_completion" || payload.object === "edit") {
    // format of completion and edit
    content = firstChoice.text;
  } else if (payload.object === "chat.completion") {
    // format of chat, without streaming
    content = firstChoice.message.content;
  } else if (payload.object === "chat.completion.chunk") {
    // format of chat, with streaming
    content = firstChoice.delta.content;
  }
  return content;
};
