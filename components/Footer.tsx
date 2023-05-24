import {
	BerlinLogo,
	CityLabLogo,
	PoliticsForTomorrowLogo,
	TSBLogo,
} from "./logos";
import { InstragramIcon } from "./icons/InstragramIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { LinkedInIcon } from "./icons/LinkedInIcon";

export const Footer = () => {
	return (
		<div className="flex flex-col gap-12 w-full">
			<div className="flex flex-col md:flex-row md:flex-wrap w-full justify-center items-center gap-x-16 gap-y-8 text-sm">
				<div className="flex flex-col items-center md:items-start gap-2">
					Entstanden durch die Zusammenarbeit von
					<div className="flex flex-col xs:flex-row xs:flex-wrap xs:pl-1 gap-x-10 gap-y-4">
						<CityLabLogo />
						<div className="ml-10 xs:ml-0">
							<PoliticsForTomorrowLogo />
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center md:items-start gap-3">
					Ein Projekt der
					<TSBLogo />
				</div>
				<div className="flex flex-col items-center md:items-start gap-1">
					Gefördert durch
					<div className="w-20">
						<BerlinLogo />
					</div>
				</div>
			</div>

			<div className="flex flex-wrap justify-center pb-4 gap-6 gap-y-6 px-8 text-sm">
				<div className="flex flex-wrap gap-6">
					<a
						href="mailto:info@citylab-berlin.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Kontakt
					</a>
					<a
						href="https://github.com/technologiestiftung/oeffentliches-gestalten-gpt-search"
						target="_blank"
						rel="noopener noreferrer"
					>
						Quellcode
					</a>
					<a
						href="https://www.technologiestiftung-berlin.de/datenschutz"
						target="_blank"
						rel="noopener noreferrer"
					>
						Datenschutz
					</a>
					<a
						href="https://www.technologiestiftung-berlin.de/impressum"
						target="_blank"
						rel="noopener noreferrer"
					>
						Impressum
					</a>
				</div>
				<div className="flex flex-nowrap gap-5">
					<a
						href="https://www.instagram.com/citylabbln/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
					>
						<InstragramIcon />
					</a>
					<a
						href="https://twitter.com/citylabberlin"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Twitter"
					>
						<TwitterIcon />
					</a>
					<a
						href="https://www.linkedin.com/company/technologiestiftung/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
					>
						<LinkedInIcon />
					</a>
				</div>
			</div>
		</div>
	);
};
