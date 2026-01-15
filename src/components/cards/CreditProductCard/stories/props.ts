import { ArgTypes } from "@storybook/react";
import { CreditProductCardProps } from "..";

const props: Partial<ArgTypes<CreditProductCardProps>> = {
  lineOfCredit: {
    control: "text",
    description:
      "Line of credit of the credit product card, displayed prominently.",
  },
  paymentMethod: {
    control: "text",
    description: "Payment channel associated with the credit product.",
  },
  loanAmount: {
    control: "number",
    description: "Total amount of the loan.",
  },
  interestRate: {
    control: "number",
    description:
      "Interest rate applied to the loan, represented as a percentage.",
  },
  termMonths: {
    control: "number",
    description: "The term length of the loan in months.",
  },
  periodicFee: {
    control: "number",
    description: "Periodic fee including both principal and interest.",
  },
  schedule: {
    control: "text",
    description: "The cycle of payments (e.g., monthly, bi-weekly).",
  },
  onEdit: {
    action: "onEdit",
    description: "Function triggered when the edit icon is clicked.",
  },
  onDelete: {
    action: "onDelete",
    description: "Function triggered when the delete icon is clicked.",
  },
};

export { props };
