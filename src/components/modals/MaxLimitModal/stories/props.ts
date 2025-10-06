import { ArgTypes } from "@storybook/react";
import { PaymentCapacityProps } from "..";

export const props: Partial<ArgTypes<PaymentCapacityProps>> = {
  handleClose: { action: "closed" },
};
