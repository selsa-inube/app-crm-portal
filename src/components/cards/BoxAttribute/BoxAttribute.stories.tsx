import { StoryFn } from "@storybook/react";
import { MdAndroid } from "react-icons/md";
import { BrowserRouter } from "react-router-dom";

import { BoxAttribute, BoxAttributeProps } from ".";
import { props } from "./props";

const story = {
  title: "components/cards/BoxAttribute",
  components: [BoxAttribute],
  tags: ["autodocs"],
  argTypes: {
    ...props,
  },
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const Default: StoryFn<BoxAttributeProps> = (args) => <BoxAttribute {...args} />;
Default.args = {
  label: "Label",
  value: "Value",
};

export const WithButton: StoryFn<BoxAttributeProps> = (args) => <BoxAttribute {...args} />;

WithButton.args = {
  label: "Label",
  value: "Value",
  withButton: true,
  buttonValue: 2,
  buttonIcon: <MdAndroid />,
};

export default story;
