import { useState } from "react";
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import "./App.css";

import type { Model, Role, Chat } from "./interfaces";
import Range from "./components/Range";
import Select from "./components/Select";

const markdown = new MarkdownIt({ html: true });

function App() {
  // const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const [mode, setMode] = useState("Complete");
  const [model, setModel] = useState<Model["Chat"]>("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(256);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ignore empty messages
    if (!userMessage.trim()) return;

    const messages = [
      {
        role: "user" as Role,
        content: userMessage,
      },
    ];
    const requestBody: Chat = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
    };
    // Create URL for the streaming edge function
    const apiUrl = "/chat";
    // Make request to Streaming Edge Function
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Handle errors
      if (!response.body) {
        throw new Error(`Request failed with status code ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Read and process the stream data
      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        const valueText = decoder.decode(value);
        // Find the returned "content" delta
        const contentRegex = /"content":"(.*?)"/;
        const match = valueText.match(contentRegex);
        if (match && match[1]) {
          // Replace newline indicator coming in as string with line break
          setChatResponse(
            (response) => `${response}${match[1].replaceAll("\\n", "<br />")}`
          );
        }
        // Update the UI using nextTick
        // await Alpine.nextTick(() => {
        //   $refs.chatRepsonsecomponent.scrollTop =
        //     $refs.chatRepsonsecomponent.scrollHeight;
        // });
        readStream();
      };
      readStream();
    } catch (error) {
      console.error("error: " + error);
    }
  };

  return (
    <div className="app">
      <div className="flex">
        <div className="chat-container">
          <h1>OpenAI API powered by Netlify Edge Functions</h1>
          <h4>OpenAI Chat Completion API(GPT3.5) [Streaming]</h4>
          <div className="chat-messages-wrapper">
            <div className="chat-messages">
              <div>
                <p className="message user right-aligned-text">{userMessage}</p>
              </div>

              <div className="message ai">
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(markdown.render(chatResponse)),
                  }}
                />
              </div>
            </div>
          </div>

          <div className="chat-form">
            <div className="chat-input">
              <form onSubmit={sendMessage}>
                <input
                  type="text"
                  onChange={(e) => setUserMessage(e.target.value)}
                  value={userMessage}
                  placeholder="Type your message..."
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
        <div className="params-container">
          <Select
            label="Mode"
            options={["Complete", "Chat", "Insert", "Edit"]}
            onChange={(e) => setMode(e.target.value)}
            value={mode}
          />
          <Select
            label="Model"
            options={["gpt-3.5-turbo", "gpt-4"]}
            onChange={(e) => setModel(e.target.value as Model["Chat"])}
            value={model}
          />
          <Range
            label="Temperature"
            min={0}
            max={1}
            step={0.01}
            value={temperature}
            onChange={setTemperature}
          />
          <Range
            label="Max tokens"
            min={1}
            max={2048}
            step={1}
            value={maxTokens}
            onChange={setMaxTokens}
          />
          <Range
            label="Top P"
            min={0}
            max={1}
            step={0.01}
            value={topP}
            onChange={setTopP}
          />
          <Range
            label="Frequency penalty"
            min={0}
            max={2}
            step={0.01}
            value={frequencyPenalty}
            onChange={setFrequencyPenalty}
          />
          <Range
            label="Presence penalty"
            min={0}
            max={2}
            step={0.01}
            value={presencePenalty}
            onChange={setPresencePenalty}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
