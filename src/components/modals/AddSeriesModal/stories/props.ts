import { ArgTypes } from "@storybook/react";
import { AddSeriesModalProps } from "..";

export const parameters = {
  docs: {
    description: {
      component: "modal to add a new series",
    },
  },
};

export const props: Partial<ArgTypes<AddSeriesModalProps>> = {
  handleClose: {
    action: "handleClose",
    description: "Función para manejar el cierre del modal",
  },
};
