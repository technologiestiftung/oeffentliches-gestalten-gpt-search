import { ChatbotOeffentlichesGestaltenLogo } from "../logos/ChatbotOeffentlichesGestaltenLogo";
import React, { useEffect, useState } from "react";
import { MessageIcon } from "../icons/MessageIcon";
import { useChatbotStore } from "../../store";
import { QuestionAnswerPair } from "../../types/questionAnswerPair";
import { getLocalStorageHistory } from "../../utils";

export const Sidebar = () => {
	const [history, setHistory] = useState<QuestionAnswerPair[]>([]);
	const isLoading = useChatbotStore((state) => state.isLoading);
	const questionAnswerPairs = useChatbotStore(
		(state) => state.questionAnswerPairs
	);
	const setQuestionAnswerPairs = useChatbotStore(
		(state) => state.setQuestionAnswerPairs
	);
	const setIsMobileSidebarVisible = useChatbotStore(
		(state) => state.setIsMobileSidebarVisible
	);

	useEffect(() => {
		setHistory(getLocalStorageHistory());
	}, [questionAnswerPairs]);

	function handleHistoryItemClick(questionAnswerPair: QuestionAnswerPair) {
		setIsMobileSidebarVisible(false);
		setQuestionAnswerPairs([questionAnswerPair])
	}

	const items = history.map((questionAnswerPair) => (
		<li key={questionAnswerPair.id}>
			<button
				className="flex p-2 gap-2 justify-start items-center text-left"
				disabled={isLoading}
				onClick={() => handleHistoryItemClick(questionAnswerPair)}
			>
				<div className="">
					<MessageIcon />
				</div>
				<div className="grow">{questionAnswerPair.question}</div>
			</button>
		</li>
	));

	return (
		<>
			<div className="flex flex-col items-center overflow-auto w-full p-4 gap-4">
				<button
					className={`${
						questionAnswerPairs.length ? "flex" : "hidden"
					} justify-center items-center px-2 py-1 text-magenta-500 border border-magenta-500 font-bold w-32 ${
						!isLoading && "hover:bg-magenta-500 hover:text-white"
					}`}
					disabled={isLoading}
					onClick={() => setQuestionAnswerPairs([])}
				>
					<span className="text-xl pb-1"></span> Neuer Chat
				</button>

				<ul className="flex flex-col">{items}</ul>
			</div>
			<div className="pb-5">
				<div className="border-t-[1px] w-full border-t-grey-200 pt-5" />
				<ChatbotOeffentlichesGestaltenLogo />
			</div>
		</>
	);
};
