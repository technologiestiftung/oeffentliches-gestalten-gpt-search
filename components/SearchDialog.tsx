import * as React from "react";
import SpinnerIcon from "./icons/SpinnerIcon";
import SourceLink from "./SourceLink";
import { EnvError } from "../lib/errors";
import { useEffect, useRef } from "react";
import { PaperPlaneIcon } from "./icons";
import ReactMarkdown from "react-markdown";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BookIcon, UserIcon } from "./icons";
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

	const [questionAnswerPairs, setQuestionAnswerPairs] =
		React.useState<QuestionAnswerPair[]>([]);

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
				className="z-10 h-full w-full overflow-auto text-xl bg-white pb-24 sm:pb-36"
				ref={conversationRef}
			>
				{!questionAnswerPairs.length && (
					<>
						<div className="flex flex-col items-center gap-6 sm:gap-6 pb-18">
							<Header />
							<Footer />
							<div className="hidden sm:flex flex-col items-center gap-4 p-2 ">
								Beispiele:
								<a
									href="#"
									className="px-2 py-1 border rounded w-full sm:w-60"
									onClick={() =>
										handleConfirm("Worüber geht es in dem Handbuch?")
									}
								>
									„Worüber geht es in dem Handbuch?“{" "}
									<span className="text-magenta-500">→</span>
								</a>
								<a
									href="#"
									className="px-2 py-1 border rounded w-full sm:w-60"
									onClick={() =>
										handleConfirm("Wann wurde das Handbuch entwickelt?")
									}
								>
									„Wann wurde das Handbuch entwickelt?“{" "}
									<span className="text-magenta-500">→</span>
								</a>
							</div>
						</div>
					</>
				)}

				{questionAnswerPairs.map(({ id, question, answer }) => (
					<div key={id}>
						<div className="flex justify-center w-full bg-blue-50">
							<div className="flex grow justify-start gap-4 p-5 max-w-[48rem]">
								<div className="w-6 mt-0.5">
									<UserIcon />
								</div>
								<p>{question}</p>
							</div>
						</div>
						{answer && (
							<div className="flex justify-center w-full">
								<div className="flex grow justify-start gap-4 p-6 max-w-[48rem]">
									<div className="w-6 -ml-1 mt-1">
										<BookIcon />
									</div>
									<ReactMarkdown
										// eslint-disable-next-line react/no-children-prop
										children={answer}
										components={{
											a: (props) => <SourceLink {...props} />,
										}}
									/>
								</div>
							</div>
						)}
					</div>
				))}

				{isLoading && (
					<div className="flex justify-center w-full">
						<div className="flex grow justify-start gap-4 p-6 max-w-[48rem]">
							<div className="w-6 -ml-1 mt-1">
								<BookIcon />
							</div>
							<div className="flex items-center gap-1 w-full">
								<p>Ich lese mal schnell das Handbuch...</p>
								<span>
									<SpinnerIcon />
								</span>
							</div>
						</div>
					</div>
				)}

				{hasError && (
					<div className="flex justify-center w-full">
						<div className="flex grow justify-start gap-4 p-6 max-w-[48rem]">
							<div className="w-6 -ml-1 mt-1">
								<BookIcon />
							</div>
							<p>
								Ups. Da ist was schief gelaufen. Lad die Seite nochmal neu und
								probier es noch einmal!
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="z-10 absolute bottom-0 w-full h-24 pt-6 sm:h-36 sm:pt-12 text-xl bg-gradient-to-t from-white via-white">
				<div className="flex justify-center">
					<form onSubmit={handleSubmit} className="grow max-w-[48rem] px-4">
						<div className="flex px-3 py-2 border border-grey-200 bg-white ">
							<input
								id="search"
								placeholder="Schreibe hier deine Frage"
								name="search"
								required
								value={search}
								disabled={isLoading || isWriting}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full leading-tight appearance-none placeholder:italic text-grey-700 focus:outline-none"
							/>
							<button className="appearance-none" type="submit">
								<PaperPlaneIcon />
							</button>
						</div>
					</form>
				</div>
				<div className="flex justify-center text-sm sm:mt-3">
					<p>
						Hier könnte z.B. ein Zeile mit einem{" "}
						<a
							href="#"
							target="_blank"
							className="text-magenta-500"
						>
							Link
						</a>
						{" "}stehen.
					</p>
				</div>
			</div>
		</>
	);
};
