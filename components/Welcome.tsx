import { Header } from "./Header";
import { Footer } from "./Footer";
import * as React from "react";
import { PaperPlaneIcon } from "./icons";
import { useChatbotStore } from "../store";
import { Suggestion } from "./Suggestion";

export const Welcome = () => {
	const handleConfirm = useChatbotStore((state) => state.handleConfirm);
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		const query = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value;

		handleConfirm({ query, isNewSession: true, isNewMessage: true });
	};

	return (
		<>
			<div className="h-full">
				<div className="h-full flex flex-col justify-between gap-5 lg:pt-16 xl:pt-24 items-center">
					<div className="flex flex-col gap-5 sm:gap-16">
						<div className="flex justify-center">
							<Header />
						</div>
						<div className="flex flex-col items-center gap-8 sm:gap-16 sm:p-2 max-w-4xl">
							<div className="flex flex-wrap justify-center gap-4 px-6">
								<Suggestion query="Was ist das Handbuch Öffentliches Gestalten?" />
								<Suggestion query="Wobei hilft mir das Handbuch?" />
								<Suggestion query="Was sind die im Handbuch vorgestellten Phasen?" />
								<Suggestion query="Was sind gute Methoden für das Ideen-Brainstorming?" />
								<Suggestion query="Wie gelange ich zu einer Entscheidung am Ende eines Workshops?" />
								<Suggestion query="Was muss ich beachten, wenn ich einen Workshop vorbereite?" />
							</div>
							<form onSubmit={handleSubmit} className=
								{`w-full absolute bottom-0 bg-gradient-to-t from-white via-white via-80% to-transparent pb-5 pt-8 px-4
								md:static md:py-0 sm:shrink`}
							>
								<div className="flex px-3 py-2 border border-grey-200 bg-white">
									<input
										id="search"
										placeholder="Schreibe hier deine Frage"
										name="search"
										required
										className="w-full leading-tight appearance-none placeholder:italic text-grey-700 focus:outline-none"
									/>
									<button className="appearance-none" type="submit">
										<PaperPlaneIcon />
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="pb-20 md:pb-4">
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};
