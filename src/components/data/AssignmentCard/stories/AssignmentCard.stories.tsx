import { BrowserRouter } from "react-router-dom";
import { StoryFn, Meta } from "@storybook/react";

import { AssignmentCard, AssignmentCardProps } from "..";

const meta: Meta<typeof AssignmentCard> = {
  component: AssignmentCard,
  title: "components/data/AssignmentCard",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<AssignmentCardProps> = (args) => <AssignmentCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Asignación 1",
  assignment: "Salario básico.",
  value: "$ 1.800.000",
};

export default meta;
