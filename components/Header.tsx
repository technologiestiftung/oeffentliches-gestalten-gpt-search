export const Header = () => {
	return (
		<div className="flex gap-2 sm:gap-5 flex-col justify-center px-12">
			<h1 className="text-4xl text-blue-500 font-semibold">
				Chatbot Öffentliches Gestalten
			</h1>

			<p className="max-w-[38rem] leading-5 text-xl">
				Das{" "}
				<a
					href="https://www.oeffentliches-gestalten.de/"
					target="_blank"
					className="text-magenta-500 font-bold"
				>
					Handbuch „Öffentliches Gestalten”
				</a>{" "}
				ist das Service Design-Lexikon, welches in Zusammenarbeit von Politics
				for Tomorrow und dem CityLAB Berlin entstanden ist. Anhand
				unterschiedlicher Methoden führt das Handbuch durch Innovationsprozesse
				– von der Theorie zur Ideenfindung durch die verschiedenen
				Umsetzungsphasen zum direkten Erbroben und Testen in der Praxis!
				<br /> <br />
				Nun haben wir unser tägliches Nachschlagewerk in einen KI-Chatbot
				verwandelt, um dir das gesammelte Wissen noch leichter zur Verfügung zu
				stellen. Du bist auf der Suche nach einer bestimmten Methode für deine
				Arbeit? Du möchtest einen Begriff erklärt bekommen oder einfach die
				Zusammenfassung eines bestimmten Kapitels?
				<br />
				Dann steht dir unser Chatbot nun Rede und Antwort!
			</p>
		</div>
	);
};
