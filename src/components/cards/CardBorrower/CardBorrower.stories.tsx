import { Meta, StoryObj } from "@storybook/react";
import { CardBorrower } from "./index";

type Story = StoryObj<typeof CardBorrower>;

const cardBorrower: Meta<typeof CardBorrower> = {
  component: CardBorrower,
  title: "components/cards/CardBorrower",
  argTypes: {
    title: {
      control: {
        type: "text",
      },
      description: "title of component",
    },
    name: {
      control: {
        type: "text",
      },
      description: "name",
    },
    lastName: {
      control: {
        type: "text",
      },
      description: "lastName",
    },
    email: {
      control: {
        type: "text",
      },
      description: "email",
    },
    income: {
      control: {
        type: "text",
      },
      description: "income",
    },
    obligations: {
      control: {
        type: "text",
      },
      description: "obligations",
    },
    showIcons: {
      control: {
        type: "boolean",
      },
      description: "show icons with actions",
    },
  },
};

export const Default: Story = {
  args: {
    title: "Codeudor",
    name: "Daniel Rodrigo",
    lastName: "Rodríguez Velandia",
    email: "daniel.rodriguez98@hotmail.com",
    income: "4.500.000",
    obligations: "1.950.000",
    showIcons: true,
  },
};

export default cardBorrower;
