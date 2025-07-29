import { RuleBuilder } from "../types";

export const ruleConfig: Record<string, RuleBuilder> = {
  LineOfCredit: (data) => ({
    ruleName: "LineOfCredit",
    conditions: [
      {
        condition: "MoneyDestination",
        value: data.MoneyDestination as string | number,
      },
      { condition: "ClientType", value: data.ClientType as string | number },
      {
        condition: "EmploymentContractTermType",
        value: data.EmploymentContractTermType as string | number,
      },
    ],
  }),
  PercentagePayableViaExtraInstallments: (data) => ({
    ruleName: "PercentagePayableViaExtraInstallments",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit as string | number,
      },
      { condition: "ClientType", value: data.ClientType as string | number },
      {
        condition: "AffiliateSeniority",
        value: data.AffiliateSeniority as string | number,
      },
    ],
  }),
  IncomeSourceUpdateAllowed: (data) => ({
    ruleName: "IncomeSourceUpdateAllowed",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit as string | number,
      },
      { condition: "ClientType", value: data.ClientType as string | number },
    ],
  }),
  LoanAmountLimit: (data) => ({
    ruleName: "LoanAmountLimit",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit as string | number,
      },
      { condition: "ClientType", value: data.ClientType as string | number },
    ],
  }),
  LoanTermLimit: (data) => ({
    ruleName: "LoanTermLimit",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit as string | number,
      },
      { condition: "ClientType", value: data.ClientType as string | number },
      { condition: "LoanAmount", value: data.LoanAmount as string | number },
    ],
  }),
  RiskFreeInterestRate: (data) => ({
    ruleName: "RiskFreeInterestRate",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit as string | number,
      },
      { condition: "LoanAmount", value: data.LoanAmount as string | number },
      { condition: "LoanTerm", value: data.LoanTerm as string | number },
    ],
  }),
};
