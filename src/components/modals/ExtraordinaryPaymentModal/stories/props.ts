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
  dataTable: {
    description: "Data to be displayed on the table",
    table: {
      type: {
        summary: "IRowExtraordinaryPayment[]",
      },
    },
  },
  handleClose: {
    description: "Function to close the modal",
    table: {
      type: {
        summary: "() => void",
      },
    },
  },
  onClickDetails: {
    description: "Function to handle the click on the details button",
    table: {
      type: {
        summary: "(id: string) => void",
      },
    },
  },
  onClickEdit: {
    description: "Function to handle the click on the edit button",
    table: {
      type: {
        summary: "(id: string) => void",
      },
    },
  },
  onClickEliminate: {
    description: "Function to handle the click on the eliminate button",
    table: {
      type: {
        summary: "(id: string) => void",
      },
    },
  },
};
