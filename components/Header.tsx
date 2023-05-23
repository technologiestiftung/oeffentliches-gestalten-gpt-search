import * as React from "react";

export const Header = () => {
	return (
		<div className="flex gap-2 sm:gap-5 flex-col justify-center px-2">
			<h1 className="text-4xl text-blue-500 font-semibold pt-2">
				Chatbot Öffentliches Gestalten
			</h1>
			<p className="max-w-[38rem] text-md leading-5 text-xl">
				Das gesammelte Wissen aus dem&nbsp;
				<a
					href="https://www.oeffentliches-gestalten.de/"
					target="_blank"
					className="text-magenta-500 font-bold"
				>
					Handbuch Öffentliches Gestalten
				</a>
				&nbsp;ist nun bequem über unseren KI Chatbot verfügbar. Stelle einfach
				eine Frage und lass&apos; dich von den Antworten inspirieren!
			</p>
			<p>
				Starte mit einem der Beispiele oder stelle deine eigene Frage:
			</p>
		</div>
	);
};
