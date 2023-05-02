import { createClient } from "@supabase/supabase-js";
import { codeBlock, oneLine } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import { ApplicationError, UserError } from "../../lib/errors";
import { CreateChatCompletionRequest } from "openai";
import { OpenAIStream } from "../../lib/openai-stream";
import { NextRequest } from "next/server";
import { ipRateLimit } from "../../lib/ip-rate-limit";
// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood. So we use the api by making fetach calls directly
export const config = {
	runtime: "edge",
};

const openAiKey = process.env.OPENAI_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: NextRequest) {
	// TODO: Find out why the types are going south here
	const resRateLimit = await ipRateLimit(req);
	if (resRateLimit.status !== 200) return resRateLimit;
	switch (req.method) {
		case "POST": {
			try {
				if (!openAiKey) {
					throw new ApplicationError("Missing environment variable OPENAI_KEY");
				}

				if (!supabaseUrl) {
					throw new ApplicationError(
						"Missing environment variable SUPABASE_URL"
					);
				}

				if (!supabaseServiceKey) {
					throw new ApplicationError(
						"Missing environment variable SUPABASE_SERVICE_ROLE_KEY"
					);
				}

				const requestData = await req.json();

				if (!requestData) {
					throw new UserError("Missing request data");
				}

				const { query } = requestData;

				if (!query) {
					throw new UserError("Missing query in request data");
				}

				const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

				// Moderate the content to comply with OpenAI T&C
				const sanitizedQuery = query.trim();
				const moderationResponse = await fetch(
					"https://api.openai.com/v1/moderations",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${openAiKey}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							input: sanitizedQuery,
						}),
					}
				).then((res) => res.json());

				const [results] = moderationResponse.results;

				if (results.flagged) {
					throw new UserError("Flagged content", {
						flagged: true,
						categories: results.categories,
					});
				}

				const embeddingResponse = await fetch(
					"https://api.openai.com/v1/embeddings",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${openAiKey}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							model: "text-embedding-ada-002",
							input: sanitizedQuery.replaceAll("\n", " "),
						}),
					}
				);

				if (embeddingResponse.status !== 200) {
					throw new ApplicationError(
						"Failed to create embedding for question",
						embeddingResponse
					);
				}

				const {
					data: [{ embedding }],
				} = await embeddingResponse.json();

				const { error: matchError, data: pageSections } =
					await supabaseClient.rpc("match_page_sections", {
						embedding,
						match_threshold: 0.78,
						match_count: 10,
						min_content_length: 50,
					});

				if (matchError) {
					throw new ApplicationError(
						"Failed to match page sections",
						matchError
					);
				}

				const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
				let tokenCount = 0;
				let contextText = "";

				for (let i = 0; i < pageSections.length; i++) {
					const pageSection = pageSections[i];
					const content = pageSection.content;
					const encoded = tokenizer.encode(content);
					tokenCount += encoded.text.length;

					if (tokenCount >= 1500) {
						break;
					}

					contextText += `${content.trim()}\n---\n`;
				}

				const prompt = codeBlock`
      ${oneLine`
				Du bist ein sehr begeisterter und freundlicher  Mitarbeiter des CityLAB, der gerne Menschen hilft!
				Mit den folgenden Abschnitte aus der Handbuch Öffentliches Gestalten, beantwortest du die Frage nur mit diesen Informationen, ausgegeben im Markdown-Format. Wenn Sie unsicher sind und die Antwort nicht explizit in dem Handbuch steht, sagst du: "Entschuldigung, damit kann ich leider nicht helfen." Du antwortest immer in Deutsch.
      `}

      Abschnitte des Handbuchs:
      ${contextText}
      Antwort als Markdown (mit möglichen Zitaten in Anführungszeichen):
    `;

				const completionOptions: CreateChatCompletionRequest = {
					model: "gpt-4",
					messages: [
						{
							role: "system",
							content: prompt,
						},
						{ role: "user", content: sanitizedQuery },
					],
					max_tokens: 2048,
					temperature: 0,
					stream: true,
				};

				const stream = await OpenAIStream(completionOptions, openAiKey);
				return new Response(stream);
			} catch (err: unknown) {
				if (err instanceof UserError) {
					return new Response(
						JSON.stringify({
							error: err.message,
							data: err.data,
						}),
						{
							status: 400,
							headers: { "Content-Type": "application/json" },
						}
					);
				} else if (err instanceof ApplicationError) {
					// Print out application errors with their additional data
					console.error(`${err.message}: ${JSON.stringify(err.data)}`);
				} else {
					// Print out unexpected errors as is to help with debugging
					console.error(err);
				}

				// TODO: include more response info in debug environments
				return new Response(
					JSON.stringify({
						error: "There was an error processing your request",
					}),
					{
						status: 500,
						headers: { "Content-Type": "application/json" },
					}
				);
			}
		}
		default:
			return new Response("Method not allowed", {
				status: 405,
			});
	}
}
