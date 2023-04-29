import type { Meta, StoryObj } from "@storybook/react";

import { SearchDialog } from "../components/SearchDialog";

const meta: Meta<typeof SearchDialog> = {
	title: "UI/SearchDialog",
	component: SearchDialog,
	tags: ["autodocs"],
	argTypes: {
		csrfToken: {
			control: "text",
		},
	},
};

export default meta;
type Story = StoryObj<typeof SearchDialog>;

export const Primary: Story = {
	args: {
		csrfToken: "missing",
	},
};
