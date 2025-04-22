import { ArgTypes } from "@storybook/react";
import { IOptionItemCheckedProps } from "..";

export const parameters = {
  docs: {
    description: {
      component: "Options to be displayed in the list",
    },
  },
};

export const props: Partial<ArgTypes<IOptionItemCheckedProps>> = {
  id: {
    description: "uniquely identifies the **OptionItem Component**",
  },
  label: {
    description: "text to display in the option item",
  },
  checked: {
    description: "sets the field as to appear checked",
    table: {
      defaultValue: { summary: "false" },
    },
  },
  onchange: {
    description:
      "allows you to control what to do when the user changes the value of the component",
  },
};
