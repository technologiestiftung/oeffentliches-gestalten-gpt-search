import { ChatSession } from "../types/chat";

export function getLocalChatSessionHistory() {
	const localHistoryJson = localStorage.getItem("ChatSessionHistory");

	if (!localHistoryJson) {
		return [];
	}

	return JSON.parse(localHistoryJson) as ChatSession[];
}

export function appendChatSessionToHistory(chatSession: ChatSession) {
	const localHistory = getLocalChatSessionHistory();
	const newHistory = [chatSession, ...localHistory];

	localStorage.setItem("ChatSessionHistory", JSON.stringify(newHistory));

	return newHistory;
}

export function updateChatSessionInHistory(updatedChatSession: ChatSession) {
	const localHistory = getLocalChatSessionHistory();

	const updatedHistory = localHistory.map((chatSession) => {
		if (chatSession.id !== updatedChatSession.id) {
			return chatSession;
		}

		return updatedChatSession;
	});

	localStorage.setItem("ChatSessionHistory", JSON.stringify(updatedHistory));

	return updatedHistory;
}

// export function getLocalStorageHistory() {
// 	const localHistoryJson = localStorage.getItem("history");
//
// 	if (!localHistoryJson) {
// 		return [];
// 	}
//
// 	return JSON.parse(localHistoryJson) as QuestionAnswerPair[];
// }
//
// export function appendLocalStorageHistory(
// 	questionAnswerPair: QuestionAnswerPair
// ) {
// 	const localHistory = getLocalStorageHistory();
// 	const newHistory = [questionAnswerPair, ...localHistory];
// 	localStorage.setItem("history", JSON.stringify(newHistory));
// }
//
// export function updateLocalStoryHistoryItem(
// 	questionAnswerPair: QuestionAnswerPair
// ) {
// 	const localHistory = getLocalStorageHistory();
// 	const updatedHistory = localHistory.map((qap) => {
// 		if (qap.id !== questionAnswerPair.id) {
// 			return qap;
// 		}
//
// 		return questionAnswerPair;
// 	});
// 	localStorage.setItem("history", JSON.stringify(updatedHistory));
// }
