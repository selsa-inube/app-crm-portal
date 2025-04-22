import { Meta, StoryObj } from "@storybook/react";
import { CardGray } from ".";

type Story = StoryObj<typeof CardGray>;

const cardGray: Meta<typeof CardGray> = {
  component: CardGray,
  title: "components/cards/CardGray",
  argTypes: {
    label: {
      control: {
        type: "text",
      },
      description: "label",
    },
    placeHolder: {
      control: {
        type: "text",
      },
      description: "placeholder",
    },
    data: {
      control: {
        type: "text",
      },
      description: "data",
    },
  },
};

export const Default: Story = {
  args: {
    label: "Correo electrónico",
    placeHolder: "daniel.rodriguez98@hotmail.com",
    data: "Cédula de ciudadanía",
  },
};

export default cardGray;
