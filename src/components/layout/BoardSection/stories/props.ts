import { ArgTypes } from "@storybook/react";

import { IBoardSectionProps } from "..";

const props: Partial<ArgTypes<IBoardSectionProps>> = {
  sectionTitle: {
    control: "text",
    description: "Section title",
  },
  sectionBackground: {
    control: {
      type: "select",
      options: ["gray", "light"],
    },
    description: "Section background",
  },
  orientation: {
    control: {
      type: "select",
      options: ["vertical", "horizontal"],
    },
    description: "Section orientation",
  },
  sectionInformation: {
    description: "information about section summary cards",
  },
};

export { props };
