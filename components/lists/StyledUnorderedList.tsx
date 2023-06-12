import React from "react";
import { UnorderedListProps } from "react-markdown/lib/ast-to-react";

export const StyledUnorderedList = (props: UnorderedListProps) => {
	return <ul className="list-disc">{props.children}</ul>;
};
