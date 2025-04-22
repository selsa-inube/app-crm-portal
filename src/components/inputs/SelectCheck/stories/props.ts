import { sizes } from "../types";
import { ArgTypes } from "@storybook/react";
import { ISelectcheckProps } from "..";

export const parameters = {
  docs: {
    description: {
      component:
        "Select allows users to make a single selection or multiple selections from a list of options.",
    },
  },
  controls: {
    exclude: ["value", "state"],
  },
};

export const props: Partial<ArgTypes<ISelectcheckProps>> = {
  label: {
    description: "prompts the user what value to enter",
  },
  name: {
    description: "name of the input element",
  },
  id: {
    description:
      "uniquely identifies the **Textfield Component**, it will also allow the **label element** to be connected to the **input element** through the htmlFor of the label",
  },
  placeholder: {
    description: "text to display in the text field whenever it is empty",
  },
  disabled: {
    description:
      "sets the field as to appear disabled, users will not be able to interact with the text field",
    table: {
      defaultValue: { summary: "false" },
    },
  },
  value: {
    description: "component initial value",
  },
  onChange: {
    description:
      "allows you to control what to do when the user changes the value of the component",
  },
  required: {
    description: "defines if the field is required or not",
    table: {
      defaultValue: { summary: "false" },
    },
  },
  status: {
    options: sizes,
    control: { type: "select" },
    description: "status of the component",
    table: {
      defaultValue: { summary: "pending" },
    },
  },
  message: {
    description:
      "show when the field is validated or invalid and there is a message",
  },
  size: {
    options: sizes,
    control: { type: "select" },
    description: "defines the size of the component",
  },
  fullwidth: {
    description: "option to fit field width to its parent width",
    table: {
      defaultValue: { summary: "false" },
    },
  },
  onFocus: {
    description:
      "allows you to control what to do when the onfocus event occurs.",
  },
  onBlur: {
    description:
      "allows you to control what to do when the onblur event occurs.",
  },
  options: {
    description:
      "(array): shall be designed to accept an array of objects with a predetermined structure.",
  },
  onChangeCheck: {
    description:
      "allows you to control what to do when the user changes the value of the checkbox",
  },
};
