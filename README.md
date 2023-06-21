# Chatbot Öffentliches Gestalten

This is a Proof-Of-Concept (POC) for a webapp using OpenAI's GPT (3-4) API as chatbot to answer questions about the book "Handbuch öffentliches Gestalten" (available online here: https://www.oeffentliches-gestalten.de/).

This POC was based on https://github.com/supabase-community/nextjs-openai-doc-search.

It is available here: https://chat.oeffentliches-gestalten.de/

## Getting Started

Start the supabase project.

```bash
supabase start
```

Copy the `.env.example` file to `.env` and add the missing variables and api keys.

Then run the development server:

```bash
npm ci
npm run dev
```

You can then open [http://localhost:3000](http://localhost:3000) in your browser and start asking questions about the book!
