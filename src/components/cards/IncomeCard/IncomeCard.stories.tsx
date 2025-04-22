import { Meta, StoryObj } from "@storybook/react";

import { IncomeCard } from "./index";

type Story = StoryObj<typeof IncomeCard>;

const incomeCard: Meta<typeof IncomeCard> = {
  component: IncomeCard,
  title: "components/cards/IncomeCard",
  argTypes: {
    title: {
      control: {
        type: "text",
      },
      description: "Title of the component.",
    },
    labels: {
      control: {
        type: "object",
      },
      description:
        "An array of labels that are displayed next to the textfields.",
    },
    placeholders: {
      control: {
        type: "object",
      },
      description:
        "An array of placeholder texts displayed inside each textfield,",
    },
    values: {
      control: {
        type: "object",
      },
      description: "An array of values that will be shown in the textfields.",
    },
    ShowSupport: {
      control: {
        type: "boolean",
      },
      description: "Defines whether to display the support.",
    },
  },
};

export const Default: Story = {
  args: {
    title: "Otros ingresos variables",
    labels: [
      "Salario mensual",
      "Otros pagos mensuales (No salariales)",
      "Mesadas pensionales",
    ],
    placeholders: [
      "Salario percibido/mes",
      "Subsidios, utilidades, propinas, etc.",
      "Pensión/mes",
    ],
    values: ["1300000", "240000", "100000"],
    ShowSupport: true,
  },
};

export default incomeCard;
