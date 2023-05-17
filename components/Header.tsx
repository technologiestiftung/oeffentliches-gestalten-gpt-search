import * as React from "react";

export const Header = () => {
	return (
		<div className="flex gap-5 flex-col justify-center text-white z-10">
			<h1 className="text-5xl font-semibold py-2">
				Handbuch GPT Suche
			</h1>
			<p className="max-w-[36rem] text-md leading-5 font-medium pb-4 text-xl">
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
