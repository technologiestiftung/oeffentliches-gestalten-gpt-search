import * as React from "react";
import Spinner from "./Spinner";
import SourceLink from "./SourceLink";
import { EnvError } from "../lib/errors";
import { useEffect, useRef } from "react";
import { PaperPlaneIcon } from "./PaperPlaneIcon";
import ReactMarkdown from "react-markdown";
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type QuestionAnswerPair = {
	question: string;
	answer: string;
	id: string;
};

async function appendAnswer(
	questionAnswerPairs: QuestionAnswerPair[],
	currentQuestionAnswerPair: QuestionAnswerPair,
	data: ReadableStream<Uint8Array>,
	setQuestionAnswerPairs: React.Dispatch<
		React.SetStateAction<QuestionAnswerPair[]>
	>,
	setIsWriting: React.Dispatch<React.SetStateAction<boolean>>
) {
	setIsWriting(true);

	const reader = data.getReader();
	const decoder = new TextDecoder("utf-8");

	let done = false;
	while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		currentQuestionAnswerPair.answer += decoder.decode(value);

		const index = questionAnswerPairs.findIndex(
			(questionAnswerPair) =>
				questionAnswerPair.id === currentQuestionAnswerPair.id
		);

		questionAnswerPairs.splice(index, 1, currentQuestionAnswerPair);
		setQuestionAnswerPairs([...questionAnswerPairs]);
	}

	setIsWriting(false);
}

export const SearchDialog: React.FC<{ csrfToken: string }> = ({
	csrfToken,
}) => {
	if (NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined)
		throw new EnvError("NEXT_PUBLIC_SUPABASE_ANON_KEY");

	const [search, setSearch] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [hasError, setHasError] = React.useState(false);
	const [isWriting, setIsWriting] = React.useState(false);

	const conversationRef = useRef<HTMLDivElement>(null);

	const [questionAnswerPairs, setQuestionAnswerPairs] = React.useState<
		QuestionAnswerPair[]
	>([]);

	useEffect(() => {
		if (!conversationRef.current) return;

		conversationRef.current?.scrollTo(0, conversationRef.current.scrollHeight);
	}, [conversationRef, questionAnswerPairs, isLoading, hasError]);

	async function handleConfirm(query: string) {
		const currentQuestionAnswerPair = {
			id: crypto.randomUUID(),
			question: query,
			answer: "",
		};

		setHasError(false);

		const updatedQuestionAnswerPairs = [
			...questionAnswerPairs,
			currentQuestionAnswerPair,
		];

		setQuestionAnswerPairs(updatedQuestionAnswerPairs);
		setIsLoading(true);

		const response = await fetch("/api/vector-search", {
			method: "POST",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
				apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
				Authorization: `Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({
				query,
				csrf_token: csrfToken,
				questionAnswerPairs,
			}),
		});

		if (!response.ok) {
			setIsLoading(false);
			setHasError(true);
			console.error(await response.text());
			return;
		}

		const data = response.body;
		if (!data) {
			setIsLoading(false);
			return;
		}
		console.log(data);

		appendAnswer(
			updatedQuestionAnswerPairs,
			currentQuestionAnswerPair,
			data,
			setQuestionAnswerPairs,
			setIsWriting
		);

		setIsLoading(false);
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (isLoading) {
			return;
		}

		handleConfirm(search);

		setSearch("");
	};

	return (
		<>
			<div
				className="z-10 h-full pb-2 overflow-auto text-xl bg-white border border-grey-200"
				ref={conversationRef}
			>
				{!questionAnswerPairs.length && (
					<div className="flex flex-col items-center gap-4 pt-4">
						Beispiele:
						<a
							href="#"
							className="px-2 py-1 border rounded w-60"
							onClick={() => handleConfirm("Worüber geht es in dem Handbuch?")}
						>
							„Worüber geht es in dem Handbuch?“{" "}
							<span className="text-magenta-500">→</span>
						</a>
						<a
							href="#"
							className="px-2 py-1 border rounded w-60"
							onClick={() =>
								handleConfirm("Wann wurde das Handbuch entwickelt?")
							}
						>
							„Wann wurde das Handbuch entwickelt?“{" "}
							<span className="text-magenta-500">→</span>
						</a>
						<a
							href="#"
							className="px-2 py-1 border rounded w-60"
							onClick={() =>
								handleConfirm("Wer hat an dem Handbuch mitgewirkt?")
							}
						>
							„Wer hat an dem Handbuch mitgewirkt?“{" "}
							<span className="text-magenta-500">→</span>
						</a>
					</div>
				)}

				{questionAnswerPairs.map(({ id, question, answer }) => (
					<div key={id}>
						<div className="flex items-baseline gap-4 p-2 bg-blue-50">
							<span className="">Ich:</span>
							<p className="italic font-bold">{question}</p>
						</div>
						{answer && (
							<>
								<div className="flex gap-3 p-2">
									<span>GPT:</span>
									<ReactMarkdown
										// eslint-disable-next-line react/no-children-prop
										children={answer}
										components={{
											a: (props) => <SourceLink {...props} />,
										}}
									/>
								</div>
							</>
						)}
					</div>
				))}

				{isLoading && (
					<div className="flex items-center gap-3 p-2 ">
						<span>GPT:</span>
						<p>Ich lese mal schnell das Handbuch...</p>
						<span>
							<Spinner />
						</span>
					</div>
				)}

				{hasError && (
					<div className="flex items-baseline gap-3 p-2 ">
						<span>GPT:</span>
						<p>
							Ups. Da ist was schief gelaufen. Lad die Seite nochmal neu und
							probier es noch einmal!
						</p>
					</div>
				)}
			</div>

			<div className="z-10 flex justify-center w-full mb-12 text-xl bg-white">
				<form onSubmit={handleSubmit} className="w-full">
					<div className="flex px-3 py-2 border border-grey-200">
						<input
							id="search"
							placeholder="Stell' eine Frage, z.B. „Wann wurde das Handbuch entwickelt?“"
							name="search"
							value={search}
							disabled={isLoading || isWriting}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full leading-tight appearance-none placeholder:italic text-grey-700 focus:outline-none"
						/>
						<button className="-rotate-45 appearance-none" type="submit">
							<PaperPlaneIcon />
						</button>
					</div>
				</form>
			</div>
		</>
	);
};
