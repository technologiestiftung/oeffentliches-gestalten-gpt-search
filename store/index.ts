import { create } from "zustand";
import { QuestionAnswerPair } from "../types/questionAnswerPair";
import {
	appendLocalStorageHistory,
	updateLocalStoryHistoryItem,
} from "../utils";
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type ChatbotStore = {
	csrfToken: string;
	setCsrfToken: (csrfToken: string) => void;

	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;

	hasError: boolean;
	setHasError: (hasError: boolean) => void;

	isWriting: boolean;
	setIsWriting: (isWriting: boolean) => void;

	questionAnswerPairs: QuestionAnswerPair[];
	setQuestionAnswerPairs: (questionAnswerPairs: QuestionAnswerPair[]) => void;

	isMobileSidebarVisible: boolean;
	setIsMobileSidebarVisible: (isMobileSidebarVisible: boolean) => void;

	handleConfirm: (query: string, shouldAppendToLocalStorage: boolean) => Promise<void>;
};

export const useChatbotStore = create<ChatbotStore>()((set, get) => ({
	csrfToken: "",
	setCsrfToken: (csrfToken) => set(() => ({ csrfToken })),

	isLoading: false,
	setIsLoading: (isLoading) => set(() => ({ isLoading })),

	hasError: false,
	setHasError: (hasError) => set(() => ({ hasError })),

	isWriting: false,
	setIsWriting: (isWriting) => set(() => ({ isWriting })),

	questionAnswerPairs: [],
	setQuestionAnswerPairs: (questionAnswerPairs) =>
		set(() => ({ questionAnswerPairs })),

	isMobileSidebarVisible: false,
	setIsMobileSidebarVisible: (isMobileSidebarVisible) =>
		set(() => ({ isMobileSidebarVisible })),

	handleConfirm: async (query, shouldAppendToLocalStorage) => {
		const currentQuestionAnswerPair = {
			id: crypto.randomUUID(),
			question: query,
			answer: "",
		};

		const previousQuestionAnswerPairs = get().questionAnswerPairs;
		const updatedQuestionAnswerPairs = [
			...previousQuestionAnswerPairs,
			currentQuestionAnswerPair,
		];
		const csrf_token = get().csrfToken;

		if (shouldAppendToLocalStorage) {
			appendLocalStorageHistory(currentQuestionAnswerPair);
		}

		set(() => ({
			hasError: false,
			questionAnswerPairs: updatedQuestionAnswerPairs,
			isLoading: true,
		}));

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
				csrf_token,
				questionAnswerPairs: previousQuestionAnswerPairs,
			}),
		});

		if (!response.ok) {
			set(() => ({ isLoading: false, hasError: true }));
			const text = await response.text();
			console.error(text);
			return;
		}

		const data = response.body;

		if (!data) {
			set(() => ({ isLoading: false }));

			return;
		}

		appendAnswer(
			updatedQuestionAnswerPairs,
			currentQuestionAnswerPair,
			data,
			set
		);

		set(() => ({ isLoading: false }));
	},
}));

async function appendAnswer(
	questionAnswerPairs: QuestionAnswerPair[],
	currentQuestionAnswerPair: QuestionAnswerPair,
	data: ReadableStream<Uint8Array>,
	set: (
		partial:
			| ChatbotStore
			| Partial<ChatbotStore>
			| ((state: ChatbotStore) => ChatbotStore | Partial<ChatbotStore>),
		replace?: boolean | undefined
	) => void
) {
	set(() => ({ isWriting: true }));

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
		set(() => ({ questionAnswerPairs: [...questionAnswerPairs] }));
	}

	updateLocalStoryHistoryItem(currentQuestionAnswerPair);

	set(() => ({ isWriting: false }));
}
