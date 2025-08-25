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
    reciprocityData: {
      control: {
        type: "object",
      },
      description: "Data for the Reciprocity modal.",
    },
    scoreData: {
      control: {
        type: "object",
      },
      description: "Data for the Score modal.",
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
    maxLimitData: {
      reportedIncomeSources: 2000000,
      reportedFinancialObligations: 6789000,
      subsistenceReserve: 2000000,
      availableForNewCommitments: 5000000,
      maxVacationTerm: 12,
      maxAmount: 1000000,
    },
    reciprocityData: {
      balanceOfContributions: 40000000,
      accordingToRegulation: 2,
      assignedQuota: 1000000,
      numRegulations: 3,
    },
    scoreData: {
      totalScore: 150,
      seniority: 150,
      centralRisk: 50,
      employmentStability: 230,
      maritalStatus: 30,
      economicActivity: 118,
      monthlyIncome: 3000000,
      maxIndebtedness: 50000000,
      incomeScore: 200,
      maxLimit: 50000000,
      totalPortafolio: 10000000,
    },
  },
};

export default creditLimitCard;
