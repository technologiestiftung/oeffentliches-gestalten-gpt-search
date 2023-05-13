import * as React from "react";
import Spinner from "./Spinner";
import { NEXT_PUBLIC_SUPABASE_ANON_KEY } from "../lib/dotenv";
function promptDataReducer(
	state: any[],
	action: {
		index?: number;
		answer?: string | undefined;
		status?: string;
		query?: string | undefined;
		type?: "remove-last-item" | string;
	}
) {
	// set a standard state to use later
	let current = [...state];

	if (action.type) {
		switch (action.type) {
			case "remove-last-item":
				current.pop();
				return [...current];
			default:
				break;
		}
	}

	// check that an index is present
	if (action.index === undefined) return [...state];

	if (!current[action.index]) {
		current[action.index] = { query: "", answer: "", status: "" };
	}

	current[action.index].answer = action.answer;

	if (action.query) {
		current[action.index].query = action.query;
	}
	if (action.status) {
		current[action.index].status = action.status;
	}

	return [...current];
}

export const SearchDialog: React.FC<{ csrfToken: string }> = ({
	csrfToken,
}) => {
	const [search, setSearch] = React.useState<string>("");
	const [question, setQuestion] = React.useState<string>("");
	const [answer, setAnswer] = React.useState<string | undefined>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [hasError, setHasError] = React.useState(false);
	const [promptIndex, setPromptIndex] = React.useState(0);
	const [promptData, dispatchPromptData] = React.useReducer(
		promptDataReducer,
		[]
	);

	const cantHelp =
		answer?.trim() === "Tut mir leid. Damit kann ich nicht dienen.";

	const handleConfirm = React.useCallback(
		async (query: string) => {
			setAnswer(undefined);
			setQuestion(query);
			setSearch("");
			dispatchPromptData({ index: promptIndex, answer: undefined, query });
			setHasError(false);
			setIsLoading(true);
			const response = await fetch("/api/vector-search", {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
					apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
					Authorization: `Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
				},
				body: JSON.stringify({ query, csrf_token: csrfToken }),
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
			const reader = data.getReader();
			const decoder = new TextDecoder("utf-8");
			let done = false;
			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunkValue = decoder.decode(value);
				setAnswer((answer) => {
					const currentAnswer = answer ?? "";

					dispatchPromptData({
						index: promptIndex,
						answer: currentAnswer + chunkValue,
					});

					return (answer ?? "") + chunkValue;
				});
			}
			setIsLoading(false);
		},
		[promptIndex, promptData]
	);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		console.log(search);

		handleConfirm(search);
	};

	return (
		<>
			<form onSubmit={handleSubmit} className={`flex flex-col max-w-md`}>
				{isLoading && (
					<div className={"flex items-center justify-left"}>
						<div className="inline-flex items-center px-4 py-2 transition duration-150 ease-in-out ">
							<Spinner />
							Ich lese mal schnell das Handbuch...
						</div>
					</div>
				)}
				{question && (
					<div className={`flex flex-row pb-4`}>
						{/* <h3 className="font-semibold">Frage:</h3> */}

						<p className="">
							<strong>Frage: </strong>
							{question}
						</p>
					</div>
				)}
				{hasError && (
					<div className={"flex flex-row pb-4"}>
						<span className="">
							Ups. Da ist was schief gelaufen. Lad die Seite nochmal neu und
							probier es noch einmal!
						</span>
					</div>
				)}
				{answer && !hasError ? (
					<div className={"flex flex-row pb-4"}>
						<p>
							<strong>Antwort:</strong> {answer}
						</p>
					</div>
				) : null}

				<div className={"flex flex-row pb-4"}>
					<textarea
						id="search"
						placeholder="Stell ein Frage…"
						rows={5}
						name="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full px-3 py-2 leading-tight text-gray-700 border shadow appearance-none focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className={"flex flex-row pb-4"}>
					<span className="pr-2 text-sm italic text-left text-blue-500">
						Versuch doch mal:{" "}
					</span>
					<button
						type="button"
						className="pr-2 text-sm italic text-left text-blue-500 hover:text-blue-900"
						onClick={(_) =>
							setSearch(
								"Wann wurde das Handbuch Öffentliches Gestalten entwickelt?"
							)
						}
					>
						Wann wurde das Handbuch Öffentliches Gestalten entwickelt?
					</button>
				</div>
				<div className={`flex items-end ml-auto flex-row pb-4`}>
					<button
						type="submit"
						className="mt-5 w-max px-4 py-1.5 transition-colors bg-magenta-500 hover:bg-white text-white hover:text-blue-500 !font-bold hover:!no-underline"
					>
						Fragen
					</button>
				</div>
			</form>
		</>
	);
};
