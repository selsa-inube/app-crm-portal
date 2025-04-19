import { BrowserRouter } from "react-router-dom";
import { StoryFn, Meta } from "@storybook/react";

import { RequestCard, RequestCardProps } from ".";

const meta: Meta<typeof RequestCard> = {
  component: RequestCard,
  title: "components/cards/RequestCard",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<RequestCardProps> = (args) => <RequestCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: "XXXXXX",
  title: "Incapacidad",
  requestDate: "25/Jul/2024",
  responsible: "Sin responsable",
};

export const WithResponsible = Template.bind({});
WithResponsible.args = {
  ...Default.args,
  responsible: "Juan Pérez",
};

export default meta;
