import React from "react";
import { transformPath } from "../lib/transform-path";
import { ReactMarkdownProps } from "react-markdown/lib/complex-types";
import { EnvError } from "../lib/errors";
const NEXT_PUBLIC_HANDBUCH_URL = process.env.NEXT_PUBLIC_HANDBUCH_URL;

const SourceLink: React.FC<
	Omit<
		React.DetailedHTMLProps<
			React.AnchorHTMLAttributes<HTMLAnchorElement>,
			HTMLAnchorElement
		>,
		"ref"
	> &
		ReactMarkdownProps
> = ({ href }) => {
	if (NEXT_PUBLIC_HANDBUCH_URL === undefined)
		throw new EnvError("NEXT_PUBLIC_HANDBUCH_URL");

	const source = `${NEXT_PUBLIC_HANDBUCH_URL}${transformPath(href ?? "")}`;

	return (
		<>
			<p className="pt-3 pb-5">
				Quelle:{" "}
				<a
					className="text-magenta-500 font-bold underline hover:text-blue-700"
					target="_blank"
					rel="noopener noreferrer"
					href={source}
				>
					{source}
				</a>
			</p>
		</>
	);
};

SourceLink.displayName = "SourceLink";
export default SourceLink;
