import { ArgTypes } from "@storybook/react";

export const parameters = {
  docs: {
    description: {
      component: "Modal utilizado para mostrar información adicional o detalles específicos.",
    },
  },
};

export const props: ArgTypes = {
  title: {
    control: {
      type: "text",
    },
    description: "Título que se mostrará en la cabecera del modal.",
    defaultValue: "Detalles de la Solicitud",
  },
  buttonLabel: {
    control: {
      type: "text",
    },
    description: "Texto que aparecerá en el botón ubicado en el modal.",
    defaultValue: "Cerrar",
  },
  portalId: {
    control: {
      type: "text",
    },
    description: "ID del elemento contenedor donde se renderiza el modal mediante un portal.",
    defaultValue: "portal",
  },
  handleClose: {
    action: "handleClose",
    description: "Función que se ejecuta para cerrar el modal.",
  },
  onSubmit: {
    action: "onSubmit",
    description: "Función que se ejecuta al enviar los datos del modal.",
  },
};
