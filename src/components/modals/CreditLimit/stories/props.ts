import { ArgTypes } from "@storybook/react";
import { ICreditLimitProps } from "..";

export const props: Partial<ArgTypes<ICreditLimitProps>> = {
  title: {
    control: { type: "text" },
    description: "The title of the modal",
  },
  handleClose: { action: "closed" },
};
