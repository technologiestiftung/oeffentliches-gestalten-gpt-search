import * as React from "react";
import { useChatbotStore } from "../store";

export const Suggestion = ({ query }: { query: string }) => {
	const handleConfirm = useChatbotStore((state) => state.handleConfirm);

	return (
		<a
			href="#"
			className="px-3.5 py-4 bg-bluegrey hover:bg-darkerbluegrey w-full sm:w-60 italic"
			onClick={() =>
				handleConfirm({
					query,
					isNewSession: true,
					isNewMessage: true,
				})
			}
		>
			{query}{" "}
		</a>
	);
};
