import { ArgTypes } from "@storybook/react";

import { ITableBoardProps } from "..";

export const props: Partial<ArgTypes<ITableBoardProps>> = {
  id: {
    control: "text",
    description: "Component identifier in the DOM",
  },
  borderTable: {
    control: "boolean",
    description: "Indicates whether or not the table has the solid border ",
  },
  entries: {
    control: "object",
    description: "Information to be displayed in table",
  },
  actions: {
    control: "object",
    description: "Actions or events you want to perform from the table",
  },
  titles: {
    control: "object",
    description: "Titles or th of the table",
  },
  loading: {
    control: "boolean",
    description: "Indicates whether the table is loading data or not",
  },
  portalId: {
    control: "text",
    description: "Portal identifier",
  },
  appearanceTable: {
    control: "object",
    description:
      "Defines the appearance of the table by allowing customization of various properties such as the title text color, the presence of a zebra stripe effect, and whether the table will display bottom borders.",
  },
};
