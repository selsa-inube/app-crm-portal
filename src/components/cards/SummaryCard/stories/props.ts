import { ArgTypes } from "@storybook/react";
import { SummaryCardProps } from "..";

const props: Partial<ArgTypes<SummaryCardProps>> = {
  rad: {
    control: "number",
    description: "Reference number of the summary",
  },
  date: { control: "date", description: "Date of the request" },
  name: { control: "text", description: "Name of the request holder" },
  destination: { control: "text", description: "Destination of the request" },
  value: { control: "number", description: "Total value of the request" },
  toDo: {
    control: "text",
    description: "Activity to be performed in the request",
  },
  path: {
    control: "text",
    description: "Navigation path when clicking on the card",
  },
  isPinned: {
    control: "boolean",
    description: "Indicates whether the card is pinned",
  },
  hasMessage: {
    control: "boolean",
    description: "Indicates whether the card has a message",
  },
};

export { props };
