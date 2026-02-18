import { Meta, StoryObj } from "@storybook/react";
import { GeneralHeader } from ".";

type Story = StoryObj<typeof GeneralHeader>;

const generalHeader: Meta<typeof GeneralHeader> = {
  component: GeneralHeader,
  title: "pages/simulateCredit/components/GeneralHeader",
  argTypes: {
    descriptionStatus: {
      control: { type: "text" },
      description: "Current status of the client or employee",
    },
    buttonText: {
      control: { type: "text" },
      description: "button text",
    },
    showButton: {
      control: { type: "boolean" },
      description: "Controls whether the button is displayed",
    },
    showIcon: {
      control: { type: "boolean" },
      description: "Controls whether the icon is displayed",
    },
  },
};

export const Default: Story = {
  args: {
    buttonText: "Agregar vinculación",
    showButton: true,
    showIcon: true,
  },
};

export default generalHeader;
