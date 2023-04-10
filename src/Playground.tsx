import { useState } from "react";
import "./Playground.css";

import type { Model, Role } from "./interfaces";
import Checkbox from "./components/Checkbox";
import Range from "./components/Range";
import Select from "./components/Select";
import TextArea from "./components/TextArea";
import TextInput from "./components/TextInput";
import { readStream } from "./utils/stream";
import { getTextFromPayload } from "./utils/text";
import { getTextInputsForEndpoint, getParametersForEndpoint } from "./utils/ui";

const getParameterDefaultValues = (endpoint: string) => {
  return getParametersForEndpoint(endpoint).reduce(
    (acc, cur) => ({ ...acc, [cur.key]: cur.defaultValue }),
    {}
  );
};

function App() {
  const [endpoint, setEndpoint] = useState("/api/openai/chat");
  const [params, setParams] = useState<any>(
    getParameterDefaultValues("/api/openai/chat")
  );
  const [aiMessage, setAiMessage] = useState("");
  const [aiImages, setAiImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEndpointChange = (value: string) => {
    setEndpoint(value);
    setParams(getParameterDefaultValues(value));
    setAiMessage("");
    setAiImages([]);
  };

  const handleChange = (key: string, value: string | number) => {
    setParams({ ...params, [key]: value });
  };

  const sendMessage = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAiMessage("");
    setAiImages([]);
    setLoading(true);

    // chat constructs messages in an array, so we special-case this a bit
    let messages = {};
    if (endpoint.includes("/chat")) {
      messages = {
        messages: [
          params.system_message && {
            role: "system" as Role,
            content: params.system_message,
          },
          params.user_message && {
            role: "user" as Role,
            content: params.user_message,
          },
        ].filter(Boolean),
      };
    }

    // this removes `system_message` and `user_message` from params,
    // as these are just variables for this playground and not what OpenAI expects.
    // the actual system and user message values are contained in `messages` above.
    const { system_message, user_message, ...body } = params;

    const requestBody = {
      ...messages,
      ...body,
    };
    // Make request to Streaming Edge Function
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      setLoading(false);
      // Handle errors
      if (!response.ok) {
        const json = await response.json();
        setError(json.error.message);
        return;
      }
      setError("");

      if (params.stream) {
        readStream(response, setAiMessage);
      } else {
        const json = await response.json();
        // first check if this is the image response
        if (Array.isArray(json.data)) {
          const images = json.data.map((datum: any) => Object.values(datum)[0]);
          setAiImages(images);
        } else {
          const text = getTextFromPayload(json);
          if (text) {
            setAiMessage((message) => `${message}${text}`);
          }
        }
      }
    } catch (err) {
      console.error("error: " + err);
    }
  };

  return (
    <div className="playground">
      <header className="flex space-between">
        <h1>OpenAI API Playground powered by Netlify Edge Functions</h1>
        <a
          href="https://app.netlify.com/start/deploy?repository=https://github.com/netlify/openai-edge-functions"
          target="_blank"
        >
          <img
            alt="Deploy to Netlify"
            src="https://www.netlify.com/img/deploy/button.svg"
          />
        </a>
      </header>
      <div className="chat-container">
        <Select
          label="Endpoint"
          options={[
            { label: "POST /api/openai/chat", value: "/api/openai/chat" },
            {
              label: "POST /api/openai/completion",
              value: "/api/openai/completion",
            },
            { label: "POST /api/openai/edit", value: "/api/openai/edit" },
            { label: "POST /api/openai/image", value: "/api/openai/image" },
          ]}
          onChange={(_, value) => handleEndpointChange(value)}
          value={endpoint}
        />
        <div className="flex">
          <div className="chat-messages-wrapper">
            <div className="flex">
              <div className="flex-grow">
                {getTextInputsForEndpoint(endpoint).map((param) => {
                  const componentMap = {
                    textarea: TextArea,
                  };
                  // @ts-expect-error
                  const Component = componentMap[param.type];
                  return (
                    <Component
                      // @ts-expect-error
                      key={param.key}
                      // @ts-expect-error
                      {...param.props}
                      // @ts-expect-error
                      value={params[param.key]}
                      onChange={handleChange}
                    />
                  );
                })}
              </div>
              <div className="response">
                <div>
                  <code>response</code>
                </div>
                <div
                  className="readonly"
                  style={{ height: "calc(100vh - 240px)" }}
                >
                  {!aiMessage && aiImages.length === 0 && !loading && (
                    <span style={{ color: "gray" }}>
                      OpenAI's response will appear here.
                    </span>
                  )}
                  {!aiMessage && loading && (
                    <span style={{ color: "gray" }}>Loading...</span>
                  )}
                  {aiMessage}
                  {aiImages.map((url) => (
                    <a key={url} href={url} target="_blank">
                      <img
                        alt={params.prompt}
                        height={128}
                        src={url}
                        width={128}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="params-container">
            {getParametersForEndpoint(endpoint).map((param) => {
              const componentMap = {
                checkbox: Checkbox,
                select: Select,
                range: Range,
                text: TextInput,
              };
              const Component = componentMap[param.type];
              return (
                <Component
                  // @ts-expect-error
                  key={param.key}
                  {...param.props}
                  // @ts-expect-error
                  value={params[param.key]}
                  // @ts-expect-error
                  onChange={handleChange}
                />
              );
            })}
          </div>
        </div>
        <div className="chat-form flex">
          <button onClick={sendMessage} type="submit">
            Send
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
