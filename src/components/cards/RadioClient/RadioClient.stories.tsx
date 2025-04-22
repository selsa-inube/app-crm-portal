import { Meta, StoryObj } from "@storybook/react";

import { clientsDataMock } from "@mocks/login/clients.mock";

import { RadioClient } from "./index";

type Story = StoryObj<typeof RadioClient>;

const radioClientMeta: Meta<typeof RadioClient> = {
  component: RadioClient,
  title: "components/cards/RadioClient",
  argTypes: {
    name: {
      control: {
        type: "text",
      },
      description: "Name attribute of the radio input.",
    },
    id: {
      control: {
        type: "text",
      },
      description: "Unique ID of the radio input.",
    },
    value: {
      control: {
        type: "text",
      },
      description: "Value attribute of the radio input.",
    },
    label: {
      control: {
        type: "text",
      },
      description: "Label displayed next to the radio input.",
    },
    logo: {
      control: {
        type: "text",
      },
      description: "URL of the logo displayed in the component.",
    },
    handleChange: {
      action: "checked",
      description:
        "Callback function triggered when the radio button is selected.",
    },
  },
};

export const Default: Story = {
  args: {
    id: clientsDataMock[2].id,
    name: "client",
    value: clientsDataMock[2].name,
    label: clientsDataMock[2].name,
    logo: clientsDataMock[2].logo,
  },
};

export default radioClientMeta;
