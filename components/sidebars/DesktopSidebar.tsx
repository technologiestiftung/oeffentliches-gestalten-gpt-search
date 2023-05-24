import { Sidebar } from "./Sidebar";

export const DesktopSidebar = () => {
	return (
		<>
			<div className="hidden lg:flex flex-col justify-between bg-bluegrey w-80 z-20">
				<Sidebar />
			</div>
		</>
	);
};
