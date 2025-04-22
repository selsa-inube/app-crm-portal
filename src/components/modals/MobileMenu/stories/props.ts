import { MobileMenuProps } from "..";

export const defaultMobileMenuProps: MobileMenuProps = {
  onClose: () => alert("Cerrar menú"),
  onReject: () => alert("Rechazar"),
  onCancel: () => alert("Anular"),
  onAttach: () => alert("Adjuntar"),
  onViewAttachments: () => alert("Ver Adjuntos"),
  onGuarantee: () => alert("Garantías ofrecidas"),
};

export const parameters = {
  docs: {
    description: {
      component: "Menu modal that provides various action buttons.",
    },
  },
};

export const props = {
  onClose: {
    description: "Function to call when closing the menu.",
  },
  onReject: {
    description: "Function to call when rejecting an item.",
  },
  onCancel: {
    description: "Function to call when cancelling an action.",
  },
  onAttach: {
    description: "Function to call when attaching an item.",
  },
  onViewAttachments: {
    description: "Function to call when viewing attachments.",
  },
};
