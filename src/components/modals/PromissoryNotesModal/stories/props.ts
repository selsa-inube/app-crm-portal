import { ArgTypes } from "@storybook/react";
import { PromissoryNotesModalProps } from "..";

export const props: Partial<ArgTypes<PromissoryNotesModalProps>> = {
  title: {
    control: {
      type: "text",
    },
    description: "Título del modal",
    defaultValue: "Confirma los datos del usuario",
  },
  buttonText: {
    control: {
      type: "text",
    },
    description: "Texto del botón",
    defaultValue: "Enviar",
  },
  formValues: {
    control: {
      type: "object",
    },
    description: "Valores del formulario",
    defaultValue: {
      field1: "usuario@inube.com",
      field2: "3122638128",
      field3: "3122638128",
    },
  },
  handleClose: {
    action: "handleClose",
    description: "Función para manejar el cierre del modal",
  },
};
