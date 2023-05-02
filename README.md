# OpenAI Search

This is a Proof Of Concept (POC) for a search engine that uses OpenAI's GPT- (3-4) API to generate search results for the project Handbuch öffentliches Gestalten. Based on https://github.com/supabase-community/nextjs-openai-doc-search and https://levelup.gitconnected.com/how-to-stream-real-time-openai-api-responses-next-js-13-2-gpt-3-5-turbo-and-edge-functions-378fea4dadb (https://archive.is/2ouIz)

## Getting Started

First copy the files from [docs](https://github.com/technologiestiftung/oeffentliches-gestalten-docusaurus/tree/main/docs) folder of the GitHub repo [technologiestiftung/oeffentliches-gestalten-docusaurus](https://github.com/technologiestiftung/oeffentliches-gestalten-docusaurus) to the pages directory.

Start the supabase project.

```bash
supabase start
```

Copy the `.env.example` file to `.env` and add the variables and api keys.

Then run the development server:

```bash
npm ci
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Regenerate the embeddings.

```bash
npm run embeddings
```

Or restore the `embeddings.dump` using tools like pgadmin.

## TODO

- [ ] Regenerate embeddings there where some errors with the source files on the first generation
- [ ] Add CSRF protection
- [ ] Add rate limiting

<!-- touch -->
