import {
	BerlinLogo,
	CityLabLogo,
	PoliticsForTomorrowLogo,
	TSBLogo,
} from "./logos";

export const Footer = () => {
	return (
		<div className="flex flex-wrap w-full justify-center gap-x-16 text-sm">
			<div className="flex flex-col items-start gap-2">
				Entstanden durch die Zusammenarbeit von
				<div className="flex flex-wrap pl-1 gap-x-10">
					<CityLabLogo />
					<PoliticsForTomorrowLogo />
				</div>
			</div>
			<div className="flex flex-col items-start gap-3">
				Ein Projekt der
				<TSBLogo />
			</div>
			<div className="flex flex-col items-start gap-1">
				Gefördert durch
				<div className="w-20">
					<BerlinLogo />
				</div>
			</div>
		</div>
	);
};
