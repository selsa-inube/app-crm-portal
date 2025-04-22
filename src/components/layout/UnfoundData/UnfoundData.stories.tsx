import { BrowserRouter } from "react-router-dom";
import { UnfoundData, UnfoundDataProps } from "./index";
import { StoryFn, Meta } from "@storybook/react";
import userNotFound from "@assets/images/ItemNotFound.png";

const meta: Meta = {
  title: "layouts/UnfoundData",
  component: UnfoundData,
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

const Template: StoryFn<UnfoundDataProps> = (args) => <UnfoundData {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: userNotFound,
  title: "Item Not Found",
  description: "We couldn't find the item you were looking for.",
  buttonDescription: "Go Home",
  route: "/home",
};
