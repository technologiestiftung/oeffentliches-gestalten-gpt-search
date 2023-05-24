import { Header } from "./Header";
import { Footer } from "./Footer";
import * as React from "react";
import { PaperPlaneIcon } from "./icons";
import { useChatbotStore } from "../store";

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
						<div className="flex flex-col items-center gap-8 sm:gap-16 sm:p-2 ">
							<div className="flex flex-wrap justify-center gap-4 px-6">
								<a
									href="#"
									className="px-3.5 py-4 bg-bluegrey hover:bg-darkerbluegrey w-full sm:w-60 italic"
									onClick={() =>
										handleConfirm({
											query:
												"Was sind gute Methoden für das Ideen-Brainstorming?",
											isNewSession: true,
											isNewMessage: true,
										})
									}
								>
									„Was sind gute Methoden für das Ideen-Brainstorming?“{" "}
								</a>
								<a
									href="#"
									className="px-3.5 py-4 bg-bluegrey hover:bg-darkerbluegrey w-full sm:w-60 italic"
									onClick={() =>
										handleConfirm({
											query:
												"Wie gelange ich zu einer Entscheidung am Ende eines Workshops?",
											isNewSession: true,
											isNewMessage: true,
										})
									}
								>
									„Wie gelange ich zu einer Entscheidung am Ende eines
									Workshops?“{" "}
								</a>
								<a
									href="#"
									className="px-3.5 py-4 bg-bluegrey hover:bg-darkerbluegrey w-full sm:w-60 italic"
									onClick={() =>
										handleConfirm({
											query:
												"Was muss ich beachten, wenn ich einen Workshop vorbereite?",
											isNewSession: true,
											isNewMessage: true,
										})
									}
								>
									„Was muss ich beachten, wenn ich einen Workshop vorbereite?“{" "}
								</a>
							</div>
							<form onSubmit={handleSubmit} className="w-full shrink px-4">
								<div className="flex px-3 py-2 border border-grey-200">
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
					<div className="pb-4">
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};
