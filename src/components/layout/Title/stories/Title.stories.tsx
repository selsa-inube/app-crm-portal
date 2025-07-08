import { BrowserRouter } from "react-router-dom";
import { MdDoorBack } from "react-icons/md";
import { Meta, StoryFn } from "@storybook/react";
import { ITitle, Title } from "../index";

const meta: Meta<typeof Title> = {
  title: "data/Title",
  component: Title,
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<ITitle> = (args) => <Title {...args} />;

const Default = Template.bind({});
Default.args = {
  title: "Title",
};

const WithCustomIcon = Template.bind({});
WithCustomIcon.args = {
  title: "Title",
  icon: <MdDoorBack />,
  navigatePage: "/",
};
export { WithCustomIcon, Default };
export default meta;
