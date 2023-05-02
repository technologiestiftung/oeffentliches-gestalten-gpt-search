import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { X, Loader, User, Frown, Wand } from "lucide-react";

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
					apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
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
			<div className="">
				<form onSubmit={handleSubmit}>
					<input type="hidden" name="csrf_token" value={csrfToken} />

					<div className="grid gap-4 py-4 text-slate-700">
						{question && (
							<div className="flex gap-4">
								<span className="flex items-center justify-center">
									<User width={18} />{" "}
								</span>
								<p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
									{question}
								</p>
							</div>
						)}

						{isLoading && <div className="relative flex ">{"-"}</div>}

						{hasError && (
							<div className="flex items-center gap-4">
								<span className="flex items-center justify-center"></span>
								<span className="">
									Ups. Da ist was schief gelaufen. Probier es noch einmal
								</span>
							</div>
						)}

						{answer && !hasError ? (
							<div className="flex items-center ">
								<span className="flex items-center justify-center">
									<Wand width={18} className="text-white" />
								</span>
								<h3 className="font-semibold">Antwort:</h3>
								{answer}
							</div>
						) : null}

						<div className="">
							<input
								placeholder="Stell ein Frage…"
								name="search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="">
							Versuch doch mal:{" "}
							<button
								type="button"
								className=""
								onClick={(_) =>
									setSearch(
										"Wann wurde das Handbuch Öffentliches Gestalten entwickelt?"
									)
								}
							>
								Wann wurde das Handbuch Öffentliches Gestalten entwickelt?
							</button>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
						>
							Fragen
						</button>
					</div>
				</form>
			</div>
			{/* </Dialog> */}
		</>
	);
};
