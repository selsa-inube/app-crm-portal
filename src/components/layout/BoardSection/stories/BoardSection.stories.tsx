import { BrowserRouter } from "react-router-dom";
import { Meta, StoryObj } from "@storybook/react";

import { RequestCard } from "@components/cards/RequestCard";
import { boardSectionConfig } from "@mocks/BoardSection/boardSection.mock";

import { Request } from "./types";
import { props } from "./props";
import { BoardSection } from "..";

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

const generateStory = (config: typeof boardSectionConfig.Default): Story => ({
  args: {
    ...config,
    CardComponent: ({ request }: { request: Request }) => (
      <RequestCard
        id={request.creditRequestCode ?? "N/A"}
        title={request.title}
        requestDate={request.creditRequestDateOfCreation ?? "N/A"}
        responsible={request.userWhoPinnnedId ?? "Sin responsable"}
      />
    ),
  },
});

export const Default: Story = generateStory(boardSectionConfig.Default);
export const ThreeRequests: Story = generateStory(boardSectionConfig.ThreeRequests);
export const FiveRequests: Story = generateStory(boardSectionConfig.FiveRequests);

export default boardSection;
