import { createClient } from "@supabase/supabase-js";
import { codeBlock, oneLine } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import { ApplicationError, AuthError, UserError } from "../../lib/errors";
import { CreateChatCompletionRequest } from "openai";
import { OpenAIStream } from "../../lib/openai-stream";
import { NextRequest } from "next/server";
import { ipRateLimit } from "../../lib/ip-rate-limit";
import { Cookies } from "react-cookie";
import { verifyCookie } from "../../lib/auth";
import { Database } from "../../types/database";

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

	const cookies = new Cookies(req.headers.get("cookie") ?? "");
	const token = cookies.get("csrf");
	let payload: unknown;
	try {
		payload = await verifyCookie(token);
	} catch (error) {
		if (error instanceof AuthError) {
			console.log(error);
			return new Response(
				JSON.stringify({ success: false, error: error.message }),
				{
					status: 401,
					headers: resRateLimit.headers,
				}
			);
		} else {
			return new Response(
				JSON.stringify({ success: false, error: "Unknown error" }),
				{
					status: 500,
					headers: resRateLimit.headers,
				}
			);
		}
	}

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

				const supabaseClient = createClient<Database>(
					supabaseUrl,
					supabaseServiceKey
				);

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

				console.log(pageSections);
				const { error: pagesError, data: pages } = await supabaseClient
					.from("nods_page")
					.select("*")
					.in(
						"id",
						pageSections.map((page) => page.page_id)
					);
				if (pagesError) {
					throw new ApplicationError(
						"Failed to match pages to pageSections",
						pagesError
					);
				}
				const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
				let tokenCount = 0;
				let contextText = "";
				const uniquePageIds = new Set();
				for (const page of pages) {
					uniquePageIds.add(page.id);
				}
				for (let i = 0; i < pageSections.length; i++) {
					const pageSection = pageSections[i];
					let content = pageSection.content;
					// filter one unique page from the array pages by matching the content pageSection["page_id"] with the page.id
					if (uniquePageIds.has(pageSection.page_id)) {
						const page = pages.find((page) => page.id === pageSection.page_id);
						if (page) {
							content += `**[${page.id}}][${page.path}]**\n\n`;
							// uniquePageIds.delete(pageSection.page_id);
						}
					}

					const encoded = tokenizer.encode(content);
					tokenCount += encoded.text.length;

					if (tokenCount >= 1500) {
						break;
					}

					contextText += `${content.trim()}\n---\n`;
				}

				const prompt = codeBlock`
      ${oneLine`
				Du bist ein sehr begeisterter und freundlicher  Mitarbeiter des CityLAB, der gerne Menschen hilft! Du antwortest immer in Deutsch. Du benutzt immer das Du nie das Sie. Du bist auch manchmal witzig.
				Mit den folgenden Abschnitte aus das Handbuch Öffentliches Gestalten, beantwortest du die Frage nur mit diesen Informationen, ausgegeben im Markdown-Format. Wenn du unsicher bist und die Antwort nicht explizit in dem Handbuch steht, sagst du: Entschuldigung, damit kann ich leider nicht helfen.
      `}
			${oneLine`Jeder Abschnitt enthält den Link zur originalen Seite aus dem Handbuch in als Markdown link mit der Seiten ID und dem Pfad[SEITEN ID](PFAD) am Ende.Diese Links müssen erhalten bleiben und in deiner Antwort angezeigt werden.Der Link sieht zum Beispiel so aus:  ** [2](/bar)** 
      Abschnitte des Handbuchs:`}
      ${contextText}
      Antwort als Markdown (mit möglichen Zitaten in Anführungszeichen):
    `;

				console.log(prompt);
				const completionOptions: CreateChatCompletionRequest = {
					model: "gpt-3.5-turbo",
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
