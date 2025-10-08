import { Meta, StoryObj } from "@storybook/react";
import { CreditLimitCard } from "./index";

type Story = StoryObj<typeof CreditLimitCard>;

const creditLimitCard: Meta<typeof CreditLimitCard> = {
  component: CreditLimitCard,
  title: "pages/simulateCredit/components/CreditLimitCard",
  argTypes: {
    creditLine: {
      control: {
        type: "number",
      },
      description: "It is the value indicated in the line of credit.",
    },
    creditLineTxt: {
      control: {
        type: "text",
      },
      description: "It is the text indicated in the line of credit.",
    },
    paymentCapacityData: {
      control: {
        type: "object",
      },
      description: "Data for the Payment Capacity modal.",
    },
  },
};

export const Default: Story = {
  args: {
    creditLine: 10000000,
    creditLineTxt: "Crediaportes.",
    creditLimitData: {
      maxPaymentCapacity: 50000000,
      maxReciprocity: 40000000,
      maxDebtFRC: 45000000,
      assignedLimit: 0,
      maxUsableLimit: 20000000,
      availableLimitWithoutGuarantee: 15000000,
    },
  },
};

export default creditLimitCard;
