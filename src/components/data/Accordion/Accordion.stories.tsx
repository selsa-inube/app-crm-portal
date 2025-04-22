import { Meta, StoryObj } from "@storybook/react";
import { Accordion } from ".";

type Story = StoryObj<typeof Accordion>;

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: "components/data/Accordeon",
  argTypes: {
    name: {
      control: {
        type: "text",
      },
      description: "name of the component",
    },
    title: {
      control: {
        type: "text",
      },
      description: "title of the component",
    },
  },
};

export const Default: Story = {
  args: {
    name: "Pagos Extra Pactados",
    title: "Pagos Extra Pactados",
    content: "esta props es opcional y su valor se refeire React.ReactNode",
  },
};

export default meta;
