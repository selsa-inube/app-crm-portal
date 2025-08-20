import { ArgTypes } from "@storybook/react";
import { PaymentCapacityProps } from "..";

export const props: Partial<ArgTypes<PaymentCapacityProps>> = {
  title: {
    control: { type: "text" },
  },
  handleClose: { action: "closed" },
};
