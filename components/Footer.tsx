import {
	BerlinLogo,
	CityLabLogo,
	PoliticsForTomorrowLogo,
	TSBLogo,
} from "./logos";

export const Footer = () => {
	return (
		<div className="flex justify-center gap-10 flex-wrap max-w-[38rem]">
			<div className="flex flex-col items-center gap-5 w-44 leading-5">
				Entstanden durch die Zusammenarbeit von
				<CityLabLogo />
				<PoliticsForTomorrowLogo />
			</div>
			<div className="flex flex-col items-center gap-5 w-44">
				Ein Projekt der
				<TSBLogo />
			</div>
			<div className="flex flex-col items-center gap-5 w-44">
				Gefördert durch
				<BerlinLogo />
			</div>
		</div>
	);
};
