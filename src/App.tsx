import { useState } from "react";
import "./App.css";

import type { ChatModel, Role, ChatRequestBody } from "./interfaces";

function App() {
  // const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const [model, setModel] = useState<ChatModel>("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ignore empty messages
    if (!userMessage.trim()) return;

    const messages = [
      {
        role: "user" as Role,
        content: userMessage,
      },
    ];
    const requestBody: ChatRequestBody = {
      model,
      messages,
      temperature,
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
        // RegEx newline indicator as a string
        const nlRegex = /\\n/g;
        const match = valueText.match(contentRegex);
        if (match && match[1]) {
          // Replace newline indicator coming in as string with line break
          setChatResponse(
            (response) => `${response}${match[1].replace(nlRegex, "<br/>")}`
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
                <p>{chatResponse}</p>
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
          <div>
            <label htmlFor="model">Model</label>
            <select
              id="model"
              onChange={(e) => setModel(e.target.value as ChatModel)}
              value={model}
            >
              <option>gpt-3.5-turbo</option>
              <option>gpt-4</option>
            </select>
          </div>
          <div>
            <div className="flex">
              <label htmlFor="temperature">Temperature</label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => setTemperature(Number(e.target.value))}
                value={temperature}
              />
            </div>
            <input
              id="temperature"
              type="range"
              min={0}
              max={1}
              step={0.01}
              onChange={(e) => setTemperature(Number(e.target.value))}
              value={temperature}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
