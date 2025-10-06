import { ArgTypes } from "@storybook/react";
import { ExtraordinaryPaymentModalProps } from "..";

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

export const props: Partial<ArgTypes<ExtraordinaryPaymentModalProps>> = {
  handleClose: {
    description: "Function to close the modal",
    table: {
      type: {
        summary: "() => void",
      },
    },
  },
};
