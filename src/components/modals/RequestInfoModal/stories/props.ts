import { ArgTypes } from "@storybook/react";

import { RequestInfoModalProps } from "..";

const props: Partial<ArgTypes<RequestInfoModalProps>> = {
  requestId: {
    control: "text",
    description: "Unique identifier for the request",
    required: true,
  },
  staffName: {
    control: "text",
    description: "Name of the staff managing the request",
    required: true,
  },
  buttonText: {
    control: "text",
    description: "Text for the primary submit button",
    defaultValue: "Entendido",
  },
  title: {
    control: "text",
    description: "Title of the modal",
    defaultValue: "Solicitud",
  },
  portalId: {
    control: "text",
    description: "ID of the portal node for rendering the modal",
    defaultValue: "portal",
  },
  onCloseModal: {
    action: "closed",
    description: "Function triggered when the modal is closed",
  },
  onSubmitButtonClick: {
    action: "submitted",
    description: "Function triggered when the submit button is clicked",
  },
};

export { props };
