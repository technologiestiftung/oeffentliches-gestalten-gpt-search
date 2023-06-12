import React from "react";
import { OrderedListProps } from "react-markdown/lib/ast-to-react";

export const StyledOrderedList = (props: OrderedListProps) => {
	return <ol className="list-decimal">{props.children}</ol>;
};
