import React from "react";
import { MenuIcon, XIcon } from "../icons";
import { Sidebar } from "./Sidebar";
import { useChatbotStore } from "../../store";

export const MobileSidebar = () => {
	const isMobileSidebarVisible = useChatbotStore(
		(state) => state.isMobileSidebarVisible
	);
	const setIsMobileSidebarVisible = useChatbotStore(
		(state) => state.setIsMobileSidebarVisible
	);

	return (
		<>
			<div className="absolute bg-white w-full top-0 lg:hidden z-30 pt-3 pl-3">
				<button className="" onClick={() => setIsMobileSidebarVisible(true)}>
					<MenuIcon />
				</button>
			</div>

			<div
				className={`absolute lg:hidden top-0 left-0 w-screen h-screen bg-grey-300 bg-opacity-40 z-40 ${
					isMobileSidebarVisible ? "visible" : "invisible"
				}`}
			>
				<div
					className={`flex items-start w-80 h-full ease-in-out duration-300 ${
						isMobileSidebarVisible ? "translate-x-0" : "-translate-x-80"
					}`}
				>
					<div className="flex bg-white h-full">
						<div className="flex flex-col justify-between bg-bluegrey">
							<Sidebar />
						</div>
					</div>
					<button
						className="p-2"
						onClick={() => setIsMobileSidebarVisible(false)}
					>
						<XIcon />
					</button>
				</div>
			</div>
		</>
	);
};
