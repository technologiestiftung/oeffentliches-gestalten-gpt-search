import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
	X,
	Loader,
	User,
	Frown,
	CornerDownLeft,
	Search,
	Wand,
} from "lucide-react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

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
	const [open, setOpen] = React.useState(false);
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

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && e.metaKey) {
				setOpen(true);
			}

			if (e.key === "Escape") {
				console.log("esc");
				handleModalToggle();
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	function handleModalToggle() {
		setOpen(!open);
		setSearch("");
		setQuestion("");
		setAnswer(undefined);
		setPromptIndex(0);
		dispatchPromptData({ type: "remove-last-item" });
		setHasError(false);
		setIsLoading(false);
	}

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
			<button
				onClick={() => setOpen(true)}
				className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[300px] "
			>
				<Search width={15} />
				<span className="h-5 border border-l"></span>
				<span className="inline-block ml-4">Suche...</span>
				<kbd
					className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
				>
					<span className="text-xs">⌘</span>K
				</kbd>{" "}
			</button>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[850px] text-black">
					<DialogHeader>
						<DialogTitle>OpenAI unterstützte Dokumenten Suche</DialogTitle>
						{/* <DialogDescription>
							Build your own ChatGPT style search with Next.js, OpenAI &
							Supabase.
						</DialogDescription> */}
						<hr />
						<button
							className="absolute top-0 p-2 right-2"
							onClick={() => setOpen(false)}
						>
							<X className="w-4 h-4 dark:text-gray-100" />
						</button>
					</DialogHeader>

					<form onSubmit={handleSubmit}>
						<input type="hidden" name="csrf_token" value={csrfToken} />

						<div className="grid gap-4 py-4 text-slate-700">
							{question && (
								<div className="flex gap-4">
									<span className="flex items-center justify-center w-8 h-8 p-2 text-center rounded-full bg-slate-100 dark:bg-slate-300">
										<User width={18} />{" "}
									</span>
									<p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
										{question}
									</p>
								</div>
							)}

							{isLoading && (
								<div className="relative flex w-5 h-5 ml-2 animate-spin">
									<Loader />
								</div>
							)}

							{hasError && (
								<div className="flex items-center gap-4">
									<span className="flex items-center justify-center w-8 h-8 p-2 text-center bg-red-100 rounded-full">
										<Frown width={18} />
									</span>
									<span className="text-slate-700 dark:text-slate-100">
										Sad news, the search has failed! Please try again.
									</span>
								</div>
							)}

							{answer && !hasError ? (
								<div className="flex items-center gap-4 dark:text-white">
									<span className="flex items-center justify-center w-8 h-8 p-2 text-center bg-green-500 rounded-full">
										<Wand width={18} className="text-white" />
									</span>
									<h3 className="font-semibold">Antwort:</h3>
									{answer}
								</div>
							) : null}

							<div className="relative">
								<Input
									placeholder="Stell ein Frage…"
									name="search"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="col-span-3"
								/>
								<CornerDownLeft
									className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
										search ? "opacity-100" : "opacity-0"
									}`}
								/>
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-100">
								Versuch doch mal:{" "}
								<button
									type="button"
									className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
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
						<DialogFooter>
							<Button type="submit" className="bg-red-500">
								Fragen
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
