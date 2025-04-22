import type { Meta, StoryObj } from "@storybook/react";

import { ControllerSelectCheck } from "./constroller";
import { parameters, props } from "./props";
import { Selectcheck } from "..";

const options = [
  { id: "uno", label: "Option 1", checked: false },
  { id: "dos", label: "Option 2", checked: false },
  { id: "tres", label: "Option 3", checked: true },
];

type Story = StoryObj<typeof Selectcheck>;

const meta: Meta<typeof Selectcheck> = {
  title: "components/inputs/SelectCheck",
  component: ControllerSelectCheck,
  parameters,
  argTypes: props,
};

export const Default: Story = {
  args: {
    name: "Selectcheck",
    id: "Selectcheck",
    placeholder: "Selectcheck",
    disabled: false,
    readonly: false,
    required: false,
    status: "pending",
    message: "Selectcheck",
    fullwidth: false,
    options: options,
    onBlur: () => {},
    onFocus: () => {},
    onClick: () => {},
  },
};

export default meta;
