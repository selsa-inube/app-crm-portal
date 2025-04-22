export const parameters = {
  docs: {
    description: {
      component: "Modal to display an unordered list of information.",
    },
  },
};

export const props = {
  title: {
    description: "main title of the modal",
  },
  portalId: {
    description: "name of the html element where the modal is rendered",
  },
  content: {
    description:
      "element to be rendered in the modal, usually a list of information. ",
  },
};
