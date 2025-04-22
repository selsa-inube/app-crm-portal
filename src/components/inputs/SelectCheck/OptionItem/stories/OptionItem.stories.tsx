import type { Meta, StoryObj } from "@storybook/react";

import { parameters, props } from "./props";
import { OptionItemChecked } from "..";

type Story = StoryObj<typeof OptionItemChecked>;

const meta: Meta<typeof OptionItemChecked> = {
  title: "components/inputs/SelectCheck/OptionItem",
  component: OptionItemChecked,
  parameters,
  argTypes: props,
};

export const Default: Story = {
  args: {
    id: "1",
    label: "Item 1",
  },
};

export default meta;
