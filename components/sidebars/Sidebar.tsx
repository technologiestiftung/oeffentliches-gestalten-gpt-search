import { ChatbotOeffentlichesGestaltenLogo } from "../logos";
import React, { useEffect } from "react";
import { MessageIcon } from "../icons";
import { useChatbotStore } from "../../store";
import { getLocalChatSessionHistory } from "../../lib/local-storage";
import { ChatSession } from "../../types/chat";

export const Sidebar = () => {
	const history = useChatbotStore((state) => state.history);
	const setHistory = useChatbotStore((state) => state.setHistory);
	const isLoading = useChatbotStore((state) => state.isLoading);
	const currentChatSession = useChatbotStore(
		(state) => state.currentChatSession
	);
	const setCurrentChatSession = useChatbotStore(
		(state) => state.setCurrentChatSession
	);
	const setIsMobileSidebarVisible = useChatbotStore(
		(state) => state.setIsMobileSidebarVisible
	);
	const handleConfirm = useChatbotStore((state) => state.handleConfirm);

	useEffect(() => {
		setHistory(getLocalChatSessionHistory());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleHistoryItemClick(selectedChatSession: ChatSession) {
		setIsMobileSidebarVisible(false);
		setCurrentChatSession(selectedChatSession);

		const lastMessage = selectedChatSession.messages.at(-1);
		if (lastMessage?.role !== "user") {
			return;
		}

		handleConfirm({
			query: lastMessage.content,
			isNewSession: false,
			isNewMessage: false,
		});
	}

	function handleNewChatClick() {
		setIsMobileSidebarVisible(false);
		setCurrentChatSession({
			id: crypto.randomUUID(),
			title: "",
			messages: [],
		});
	}

	const items = history.map((chatSession) => (
		<li key={chatSession.id}>
			<button
				className="flex p-2 gap-2 justify-start items-center text-left"
				disabled={isLoading}
				onClick={() => handleHistoryItemClick(chatSession)}
			>
				<div>
					<MessageIcon />
				</div>
				<div className="grow line-clamp-3">
					{chatSession.title || chatSession.messages[0].content}
				</div>
			</button>
		</li>
	));

	return (
		<>
			<div className="flex flex-col items-center overflow-auto w-full p-4 gap-4">
				<button
					className={`${
						currentChatSession.messages.length ? "flex" : "hidden"
					} justify-center items-center px-2 py-1 text-magenta-500 border border-magenta-500 font-bold w-32 ${
						!isLoading && "hover:bg-magenta-500 hover:text-white"
					}`}
					disabled={isLoading}
					onClick={() => handleNewChatClick()}
				>
					<span className="text-xl pb-1"></span> Neuer Chat
				</button>

				<ul className="flex flex-col">{items}</ul>
			</div>
			<div className="pb-5">
				<div className="border-t-[1px] w-full border-t-grey-200 pt-5" />
				<div className="px-5">
					<ChatbotOeffentlichesGestaltenLogo />
				</div>
			</div>
		</>
	);
};
