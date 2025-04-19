import { ArgTypes } from "@storybook/react";

import { InfoModalProps } from "..";

const props: Partial<ArgTypes<InfoModalProps>> = {
  buttonText: {
    control: "text",
    description: "Text for the primary submit button",
    defaultValue: "Entendido",
  },
  description: {
    control: "text",
    description: "Content displayed as the modal's main description",
    defaultValue: "Descripcion por defecto",
  },
  titleDescription: {
    control: "text",
    description: "Small heading for the description section",
    defaultValue: "Titulo de la descripcion",
  },
  title: {
    control: "text",
    description: "Title of the modal",
    defaultValue: "Información",
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
};

export { props };
