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
> = ({ href, children }) => {
	if (NEXT_PUBLIC_HANDBUCH_URL === undefined)
		throw new EnvError("NEXT_PUBLIC_HANDBUCH_URL");
	return (
		<a
			className="text-blue-500 underline hover:text-blue-700"
			target="_blank"
			rel="noopener noreferrer"
			href={`${NEXT_PUBLIC_HANDBUCH_URL}${transformPath(href ?? "")}`}
		>
			{children}
		</a>
	);
};

SourceLink.displayName = "SourceLink";
export default SourceLink;
