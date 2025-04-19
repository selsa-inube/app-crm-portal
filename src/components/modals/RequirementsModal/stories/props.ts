import { ArgTypes } from "@storybook/react";

export const parameters = {
  docs: {
    description: {
      component: "Modal used to display additional information or specific requirement details.",
    },
  },
};

export const props: ArgTypes = {
  title: {
    control: {
      type: "text",
    },
    description: "Title displayed in the modal header.",
    defaultValue: "Request Details",
  },
  buttonLabel: {
    control: {
      type: "text",
    },
    description: "Text displayed on the button inside the modal.",
    defaultValue: "Close",
  },
  portalId: {
    control: {
      type: "text",
    },
    description: "ID of the container element where the modal is rendered via a portal.",
    defaultValue: "portal",
  },
  handleClose: {
    action: "handleClose",
    description: "Function executed to close the modal.",
  },
};
