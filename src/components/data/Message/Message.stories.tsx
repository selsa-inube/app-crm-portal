import { Meta, StoryFn } from "@storybook/react";
import { Message, MessageProps } from "@components/data/Message";
import { BrowserRouter } from "react-router-dom";

const story: Meta<typeof Message> = {
  title: "components/data/Message",
  component: Message,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<MessageProps> = (args) => <Message {...args} />;

const SentMessage = Template.bind({});
SentMessage.args = {
  type: "sent",
  timestamp: Date.now(),
  message: "Esto es un mensaje enviado.",
};

const ReceivedMessage = Template.bind({});
ReceivedMessage.args = {
  type: "received",
  timestamp: Date.now(),
  message: "Esto es un mensaje recibido.",
};

export { SentMessage, ReceivedMessage };
export default story;
