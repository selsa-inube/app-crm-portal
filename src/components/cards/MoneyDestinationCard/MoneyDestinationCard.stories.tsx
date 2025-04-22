import { Meta, StoryObj } from "@storybook/react";

import { MoneyDestinationCard } from "./index";

type Story = StoryObj<typeof MoneyDestinationCard>;

const moneyDestinationCard: Meta<typeof MoneyDestinationCard> = {
  component: MoneyDestinationCard,
  title: "components/Cards/MoneyDestinationCard",
  argTypes: {
    id: {
      control: {
        type: "text",
      },
      description: "Unique identifier for the radio option.",
    },
    name: {
      control: {
        type: "text",
      },
      description: "Name of the radio input, used to group radio options.",
    },
    value: {
      control: {
        type: "text",
      },
      description: "Value associated with the radio option.",
    },
    label: {
      control: {
        type: "text",
      },
      description: "Text label displayed next to the radio option.",
    },
    icon: {
      control: {
        type: "object",
      },
      description: "Icon element to display on the card.",
    },
    handleChange: {
      control: {
        type: "object",
      },
      description: "Function called when the radio option is selected.",
    },
  },
};

export const Default: Story = {
  args: {
    id: "Id",
    name: "Client",
    value: "Value",
    label: "Label",
    icon: "MdAndroid",
    isSelected: false,
  },
};

export default moneyDestinationCard;
