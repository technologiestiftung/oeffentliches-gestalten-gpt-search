import * as React from "react";

export const Header = () => {
	return (
		<div className="flex gap-2 sm:gap-5 flex-col justify-center z-10 px-2">
			<h1 className="text-5xl font-semibold pt-2">
				Chatbot Öffentliches Gestalten
			</h1>
			<p className="max-w-[38rem] text-md leading-5 font-mediumtext-xl">
				Das gesammelte Wissen aus dem&nbsp;
				<a
					href="https://www.oeffentliches-gestalten.de/"
					target="_blank"
					className="text-magenta-500"
				>
					Handbuch Öffentliches Gestalten
				</a>
				&nbsp;ist nun bequem über unseren KI Chatbot verfügbar. Stelle einfach
				eine Frage und lass&apos; Dich von den Antworten inspirieren!
			</p>
		</div>
	);
};
