import { BrowserRouter } from "react-router-dom";
import { Meta, StoryObj } from "@storybook/react";

import { mockRequests } from "@mocks/requests/requests.mock";

import { BoardSection } from "..";
import { props } from "./props";

type Story = StoryObj<typeof BoardSection>;

const boardSection: Meta<typeof BoardSection> = {
  component: BoardSection,
  title: "layouts/BoardSection",
  argTypes: props,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const Default: Story = {
  args: {
    sectionTitle: "BoardSectionTitle",
    sectionBackground: "gray",
    orientation: "vertical",
    sectionInformation: mockRequests,
    pinnedRequests: [],
    handlePinRequest: (requestId: string) => {
      console.log(`Pin request: ${requestId}`);
    },
    errorLoadingPins: false,
  },
};

export default boardSection;
