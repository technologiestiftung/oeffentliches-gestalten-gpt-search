import { create } from "zustand";
import {
	appendChatSessionToHistory,
	updateChatSessionInHistory,
} from "../lib/local-storage";
import { ChatSession, Message } from "../types/chat";
import { randomUUID } from "crypto";
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

	currentChatSession: ChatSession;
	setCurrentChatSession: (chatSession: ChatSession) => void;

	history: ChatSession[];
	setHistory: (chatSession: ChatSession[]) => void;

	isMobileSidebarVisible: boolean;
	setIsMobileSidebarVisible: (isMobileSidebarVisible: boolean) => void;

	handleConfirm: ({
		query,
		isNewSession,
		isNewMessage,
	}: {
		query: string;
		isNewSession: boolean;
		isNewMessage: boolean;
	}) => Promise<void>;
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

	currentChatSession: getInitialChatSession(),
	setCurrentChatSession: (chatSession) =>
		set(() => ({ currentChatSession: chatSession })),

	history: [],
	setHistory: (chatSession: ChatSession[]) => {
		set(() => ({ history: chatSession }));
	},

	isMobileSidebarVisible: false,
	setIsMobileSidebarVisible: (isMobileSidebarVisible) =>
		set(() => ({ isMobileSidebarVisible })),

	handleConfirm: async ({ query, isNewSession, isNewMessage }) => {
		const currentMessage: Message = {
			id: crypto.randomUUID(),
			role: "user",
			content: query,
		};

		const currentChatSession = get().currentChatSession;

		const csrf_token = get().csrfToken;

		if (isNewSession) {
			const updatedHistory = appendChatSessionToHistory(currentChatSession);

			set(() => ({
				history: updatedHistory,
			}));
		}

		if (isNewMessage) {
			currentChatSession.messages.push(currentMessage);
			const updatedHistory = updateChatSessionInHistory(currentChatSession);
			set(() => ({
				currentChatSession,
				history: updatedHistory,
			}));
		}

		set(() => ({
			hasError: false,
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
				currentChatSession,
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

		appendAnswer(currentChatSession, currentMessage, data, set);

		set(() => ({ isLoading: false }));
	},
}));

async function appendAnswer(
	currentChatSession: ChatSession,
	currentMessage: Message,
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

	const answerId = crypto.randomUUID();
	const answer: Message = {
		id: answerId,
		role: "assistant",
		content: "",
	};

	currentChatSession.messages.push(answer);

	set(() => ({ currentChatSession }));

	let done = false;
	while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		answer.content += decoder.decode(value);

		const index = currentChatSession.messages.findIndex(
			(message) => message.id === answer.id
		);

		currentChatSession.messages.splice(index, 1, answer);
		set(() => ({
			currentChatSession: {
				id: currentChatSession.id,
				title: currentChatSession.title,
				messages: currentChatSession.messages,
			},
		}));
	}

	const updatedHistory = updateChatSessionInHistory(currentChatSession);

	set(() => ({ isWriting: false, history: updatedHistory }));
}

function getInitialChatSession() {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return {
			id: crypto.randomUUID(),
			messages: [],
			title: "",
		};
	}

	return {
		id: randomUUID(),
		messages: [],
		title: "",
	};
}
