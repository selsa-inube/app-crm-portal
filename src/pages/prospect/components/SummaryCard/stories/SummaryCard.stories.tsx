import { StoryFn, Meta } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import { SummaryCard, SummaryCardProps } from "..";

import { props } from "./props";

const story: Meta<typeof SummaryCard> = {
  component: SummaryCard,
  argTypes: props,
  title: "components/prospect/components/SummaryCard",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const Default: StoryFn<SummaryCardProps> = (args) => (
  <SummaryCard {...args} />
);

Default.args = {
  rad: "100000012",
  date: "Septiembre 30/23",
  name: "Juan Sebastian Moralez García",
  destination: "Educación de Postgrado a menos de tres meses",
  value: 10000000,
  toDo: "Aceptación por parte del cliente de la propuesta",
  path: "/",
};

export default story;
