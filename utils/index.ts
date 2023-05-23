import {QuestionAnswerPair} from "../types/questionAnswerPair";

export function getLocalStorageHistory() {
	const localHistoryJson = localStorage.getItem("history");

	if (!localHistoryJson) {
		return [];
	}

	return JSON.parse(localHistoryJson) as QuestionAnswerPair[];
}

export function appendLocalStorageHistory(
	questionAnswerPair: QuestionAnswerPair
) {
	const localHistory = getLocalStorageHistory();
	const newHistory = [questionAnswerPair, ...localHistory];
	localStorage.setItem("history", JSON.stringify(newHistory));
}

export function updateLocalStoryHistoryItem(questionAnswerPair: QuestionAnswerPair) {
	const localHistory = getLocalStorageHistory();
	const updatedHistory = localHistory.map((qap) => {
		if (qap.id !== questionAnswerPair.id) {
			return qap;
		}

		return questionAnswerPair;
	});
	localStorage.setItem("history", JSON.stringify(updatedHistory));
}