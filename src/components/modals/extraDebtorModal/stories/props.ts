export const parameters = {
  docs: {
    description: {
      component:
        "Modal for product prospecting, allowing form inputs for asset details.",
    },
  },
};

export const props = {
  portalId: {
    description: "ID of the HTML element where the modal will be rendered.",
  },
  title: {
    description: "Main title of the modal.",
  },
  confirmButtonText: {
    description: "Label for the confirmation button.",
  },
  initialValues: {
    description: "Initial values for the form managed by Formik.",
  },
  iconBefore: {
    description: "Icon displayed before the confirm button text.",
  },
  iconAfter: {
    description: "Icon displayed after the confirm button text.",
  },
  onCloseModal: {
    description: "Function called when the modal's close button is clicked.",
  },
  onConfirm: {
    description:
      "Function called when the confirm button is clicked and the form is valid.",
  },
};
