import * as React from "react";
import SpinnerIcon from "./icons/SpinnerIcon";
import SourceLink from "./SourceLink";
import { useEffect, useRef } from "react";
import { PaperPlaneIcon } from "./icons";
import ReactMarkdown from "react-markdown";
import { BookIcon, UserIcon } from "./icons";
import { Welcome } from "./Welcome";
import { useChatbotStore } from "../store";
import { StyledOrderedList } from "./lists/StyledOrderedList";
import { StyledUnorderedList } from "./lists/StyledUnorderedList";

export const SearchDialog: React.FC = () => {
	const [search, setSearch] = React.useState<string>("");
	const isLoading = useChatbotStore((state) => state.isLoading);
	const hasError = useChatbotStore((state) => state.hasError);
	const isWriting = useChatbotStore((state) => state.isWriting);

	const currentChatSession = useChatbotStore(
		(state) => state.currentChatSession
	);
	const handleConfirm = useChatbotStore((state) => state.handleConfirm);

	const conversationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!conversationRef.current || !currentChatSession.messages.length) return;

		conversationRef.current?.scrollTo(0, conversationRef.current.scrollHeight);
	}, [currentChatSession, isLoading, hasError]);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (isLoading) {
			return;
		}

		handleConfirm({ query: search, isNewSession: false, isNewMessage: true });

		setSearch("");
	};

	return (
		<>
			<div className="flex flex-col w-full justify-between pt-12 lg:pt-0">
				<div
					className={`z-10 h-full w-full overflow-auto text-xl ${
						currentChatSession.messages.length > 0 && "pb-[4.5rem]"
					}`}
					ref={conversationRef}
				>
					{!currentChatSession.messages.length && <Welcome />}

					{currentChatSession.messages.map(({ id, role, content }) => (
						<div key={id}>
							{role === "user" && (
								<div className="flex justify-center w-full bg-blue-50">
									<div className="flex grow justify-start gap-4 p-5 max-w-[48rem]">
										<div className="w-6 mt-0.5">
											<UserIcon />
										</div>
										<p>{content}</p>
									</div>
								</div>
							)}
							{role === "assistant" && (
								<div className="flex justify-center w-full">
									<div className="flex grow justify-start gap-4 p-6 max-w-[48rem]">
										<div className="w-6 -ml-1 mt-1">
											<BookIcon />
										</div>
										<div className="flex flex-col gap-4">
											<ReactMarkdown
												// eslint-disable-next-line react/no-children-prop
												children={content}
												components={{
													a: (props) => <SourceLink {...props} />,
													ol: (props) => <StyledOrderedList {...props} />,
													ul: (props) => <StyledUnorderedList {...props} />,
												}}
											/>
										</div>
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

				{currentChatSession.messages.length > 0 && (
					<div className="relative">
						<div className="z-20 absolute w-full bottom-0 items-center h-28 text-xl bg-gradient-to-t from-white via-white to-transparent">
							<div className="flex justify-center bg-white mt-12">
								<form
									onSubmit={handleSubmit}
									className="grow max-w-[48rem] px-4"
								>
									<div className="flex px-3 py-2 border border-grey-200">
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
						</div>
					</div>
				)}
			</div>
		</>
	);
};
