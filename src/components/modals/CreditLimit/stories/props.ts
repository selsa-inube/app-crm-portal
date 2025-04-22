import { ArgTypes } from "@storybook/react";
import { ICreditLimitProps } from "..";

export const props: Partial<ArgTypes<ICreditLimitProps>> = {
  title: {
    control: { type: "text" },
    description: "The title of the modal",
  },
  maxPaymentCapacity: {
    control: { type: "number" },
    description: "Maximum payment capacity",
  },
  maxReciprocity: {
    control: { type: "number" },
    description: "Maximum reciprocity amount",
  },
  maxDebtFRC: {
    control: { type: "number" },
    description: "Maximum debt under FRC",
  },
  assignedLimit: {
    control: { type: "number" },
    description: "Assigned credit limit",
  },
  currentPortfolio: {
    control: { type: "number" },
    description: "Current portfolio balance",
  },
  maxUsableLimit: {
    control: { type: "number" },
    description: "Maximum usable limit",
  },
  availableLimitWithoutGuarantee: {
    control: { type: "number" },
    description: "Available limit without a guarantee",
  },
  handleClose: { action: "closed" },
};
