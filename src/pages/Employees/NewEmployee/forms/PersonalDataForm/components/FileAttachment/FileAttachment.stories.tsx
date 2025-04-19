import { Meta, StoryObj } from "@storybook/react";

import { FileAttachment } from ".";

const meta: Meta<typeof FileAttachment> = {
  title: "Components/input/FileAttachment",
  component: FileAttachment,
};

export default meta;

type Story = StoryObj<typeof FileAttachment>;

export const Default: Story = {
  args: {},
};
