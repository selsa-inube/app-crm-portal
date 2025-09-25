import { RuleBuilder } from "../types";

export const ruleConfig: Record<string, RuleBuilder> = {
  LineOfCredit: (data) => ({
    ruleName: "LineOfCredit",
    conditions: [
      { condition: "MoneyDestination", value: data.MoneyDestination },
      { condition: "ClientType", value: data.ClientType },
      {
        condition: "EmploymentContractTermType",
        value: data.EmploymentContractTermType,
      },
    ],
  }),
  LoanAmountLimit: (data) => ({
    ruleName: "LoanAmountLimit",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
      { condition: "AffiliateSeniority", value: data.AffiliateSeniority },
    ],
  }),
  LoanTerm: (data) => ({
    ruleName: "LoanTerm",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
      { condition: "LoanAmount", value: data.LoanAmount },
    ],
  }),
  FixedInterestRate: (data) => ({
    ruleName: "FixedInterestRate",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "LoanAmount", value: data.LoanAmount },
      { condition: "LoanTerm", value: data.LoanTerm },
    ],
  }),
};
