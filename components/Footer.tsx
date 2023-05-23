import {
	BerlinLogo,
	CityLabLogo,
	PoliticsForTomorrowLogo,
	TSBLogo,
} from "./logos";

export const Footer = () => {
	return (
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
	);
};
