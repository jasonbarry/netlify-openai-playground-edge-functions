const COMPLETION = "/api/openai/completion";
const CHAT = "/api/openai/chat";
const EDIT = "/api/openai/edit";
const IMAGE = "/api/openai/image";

type Param = {
  key: string;
  type: "checkbox" | "range" | "select";
  defaultValue: boolean | number | string;
  props: {
    label: string;
    max?: number;
    min?: number;
    options?: string[];
    step?: number;
    title?: string;
  };
};

const modelsForEndpoint = {
  [COMPLETION]: [
    "text-davinci-003",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
    "text-davinci-002",
    "text-davinci-001",
    "davinci-instruct-beta",
    "davinci",
    "curie-instruct-beta",
    "curie",
    "babbage",
    "ada",
    "chat-davinci-003-alpha",
  ],
  [CHAT]: ["gpt-4-1106-preview", "gpt-4", "gpt-3.5-turbo"],
  [EDIT]: ["text-davinci-edit-001", "code-davinci-edit-001"],
};

export const getTextInputsForEndpoint = (endpoint: string) => {
  return [
    [CHAT].includes(endpoint) && {
      key: "system_message",
      type: "textarea",
      defaultValue: "You are a helpful assistant.",
      props: {
        label: "system_message",
        placeholder: "Enter a system message here.",
        style: { height: "calc(44vh - 120px)" },
        value: "You are a helpful assistant.",
      },
    },
    [CHAT].includes(endpoint) && {
      key: "user_message",
      type: "textarea",
      defaultValue: "",
      props: {
        label: "user_message",
        placeholder: "Enter a user message here.",
        style: { height: "calc(44vh - 120px)" },
      },
    },
    [COMPLETION, IMAGE].includes(endpoint) && {
      key: "prompt",
      type: "textarea",
      defaultValue: "",
      props: {
        label: "prompt",
        placeholder: "Enter a prompt here.",
        title:
          "The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.",
        style: { height: "calc(100vh - 240px)" },
      },
    },
    [EDIT].includes(endpoint) && {
      key: "input",
      type: "textarea",
      defaultValue: "",
      props: {
        label: "input",
        placeholder: "Thank you very much!",
        style: { height: "calc(44vh - 120px)" },
        value: "You are a helpful assistant.",
      },
    },
    [EDIT].includes(endpoint) && {
      key: "instruction",
      type: "textarea",
      defaultValue: "",
      props: {
        label: "instruction",
        placeholder: "Translate to French.",
        style: { height: "calc(44vh - 120px)" },
      },
    },
  ].filter(Boolean);
};

export const getParametersForEndpoint = (endpoint: string): Param[] => {
  return [
    [COMPLETION, CHAT, EDIT].includes(endpoint) && {
      key: "model",
      type: "select",
      // @ts-expect-error
      defaultValue: modelsForEndpoint[endpoint][0],
      props: {
        label: "model",
        title:
          "ID of the model to use. You can use the List models API to see all of your available models.",
        // @ts-expect-error
        options: modelsForEndpoint[endpoint],
      },
    },
    [COMPLETION, CHAT].includes(endpoint) && {
      key: "stream",
      type: "checkbox",
      defaultValue: true,
      props: {
        label: "stream",
        title:
          "Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.",
        value: true,
      },
    },
    [COMPLETION, CHAT, EDIT].includes(endpoint) && {
      key: "temperature",
      type: "range",
      defaultValue: 0.7,
      props: {
        label: "temperature",
        title:
          "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
    [COMPLETION, CHAT].includes(endpoint) && {
      key: "max_tokens",
      type: "range",
      defaultValue: 256,
      props: {
        label: "max_tokens",
        title:
          "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).",
        min: 1,
        max: 2048,
        step: 1,
      },
    },
    [COMPLETION].includes(endpoint) && {
      key: "stop",
      type: "text",
      defaultValue: "",
      props: {
        label: "stop",
        title:
          "A stop sequence will stop generating further tokens. The returned text will not contain the stop sequence.",
      },
    },
    [COMPLETION, CHAT, EDIT].includes(endpoint) && {
      key: "top_p",
      type: "range",
      defaultValue: 1,
      props: {
        label: "top_p",
        title:
          "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.",
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
    [COMPLETION, CHAT].includes(endpoint) && {
      key: "frequency_penalty",
      type: "range",
      defaultValue: 0,
      props: {
        label: "frequency_penalty",
        title:
          "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
        min: -2,
        max: 2,
        step: 0.01,
      },
    },
    [COMPLETION, CHAT].includes(endpoint) && {
      key: "presence_penalty",
      type: "range",
      defaultValue: 0,
      props: {
        label: "presence_penalty",
        title:
          "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
        min: -2,
        max: 2,
        step: 0.01,
      },
    },
    [IMAGE].includes(endpoint) && {
      key: "size",
      type: "select",
      defaultValue: "1024x1024",
      props: {
        label: "size",
        title: "The size of the generated images.",
        options: ["1024x1024", "512x512", "256x256"],
      },
    },
    [IMAGE].includes(endpoint) && {
      key: "n",
      type: "range",
      defaultValue: 1,
      props: {
        label: "n",
        title: "The number of images to generate.",
        min: 1,
        max: 10,
        step: 1,
      },
    },
    [IMAGE].includes(endpoint) && {
      key: "response_format",
      type: "select",
      defaultValue: "url",
      props: {
        label: "response_format",
        title: "The format in which the generated images are returned.",
        options: ["url", "b64_json"],
      },
    },
    {
      key: "user",
      type: "text",
      defaultValue: "",
      props: {
        label: "user",
        title:
          "A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.",
      },
    },
  ].filter(Boolean) as Param[];
};
