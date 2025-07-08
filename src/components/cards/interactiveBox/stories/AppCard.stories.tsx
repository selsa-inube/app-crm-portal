import { BrowserRouter } from "react-router-dom";
import { MdContacts } from "react-icons/md";
import { StoryFn, Meta } from "@storybook/react";

import { InteractiveBox, IInteractiveBox } from "..";

const meta: Meta<typeof InteractiveBox> = {
  component: InteractiveBox,
  title: "feedback/InteractiveBox",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<IInteractiveBox> = (args) => (
  <InteractiveBox {...args} />
);

const Default = Template.bind({});
Default.args = {
  label: "Card Title",
  description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  icon: <MdContacts />,
  url: "/positions",
};
export { Default };
export default meta;
