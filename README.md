# Stream OpenAI responses using Netlify Edge Functions

Easily integrate your site with OpenAI APIs -- including those that stream responses -- with Netlify Edge Functions.

In just a few clicks (it takes less than 5 minutes, seriously!) you can incorporate ChatGPT-like functionality on a site that you own.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/openai-edge-functions)

This repo is built to show the power of Netlify Edge Functions and how easy its to build streaming applications.

Deploying this to your site will add four endpoints:

- POST `/api/openai/chat` (create a chat-like experience like ChatGPT)
- POST `/api/openai/completion` (enter a prompt to generate appended text)
- POST `/api/openai/edit` (provide instructions on how to edit the text input)
- POST `/api/openai/image` (create images from a text prompt)

You must have an `OPENAI_API_KEY` environment variable set on your site. Deploying with the Deploy to Netlify button will ask you to paste your API token in.

Check the `defaultParams` object in each edge function to see what data is accepted in the request body. This aims to have parity with OpenAI's request body for each of the supported endpoints, so you can use their [API reference](https://platform.openai.com/docs/api-reference/introduction) as guidance.
