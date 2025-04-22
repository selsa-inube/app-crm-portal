import { StoryFn } from "@storybook/react";
import { ErrorAlert, ErrorAlertProps } from "./index";

export default {
  title: "layouts/ErrorAlert",
  component: ErrorAlert,
  argTypes: {
    errorKey: { control: "boolean" },
    message: { control: "text" },
  },
};

const Template: StoryFn<ErrorAlertProps> = (args) => <ErrorAlert {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: "Existe un error sin evaluar",
};
