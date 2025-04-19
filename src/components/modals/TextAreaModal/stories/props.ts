import { ArgTypes } from "@storybook/react";

import { TextAreaModalProps } from "..";

const props: Partial<ArgTypes<TextAreaModalProps>> = {
  title: {
    control: "text",
    description: "Title of the modal",
  },
  buttonText: {
    control: "text",
    description: "Text for the submit button",
  },
  inputLabel: {
    control: "text",
    description: "Label for the textarea input",
  },
  inputPlaceholder: {
    control: "text",
    description: "Placeholder for the textarea input",
  },
  maxLength: {
    control: "number",
    description: "Maximum length of the textarea input",
  },
  portalId: {
    control: "text",
    description: "ID of the portal node",
  },
  onSubmit: {
    action: "submitted",
    description: "Function called when the form is submitted",
  },
  onCloseModal: {
    action: "closed",
    description: "Function called when the modal is closed",
  },
};

export { props };
