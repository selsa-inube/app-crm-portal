import { ContextData } from "@pages/applyForCredit/util";

import { RuleBuilder } from "../types";

export const ruleConfig: Record<string, RuleBuilder> = {
  LineOfCredit: (data) => ({
    ruleName: "LineOfCredit",
    conditions: [
      {
        condition: "MoneyDestination",
        value: data.MoneyDestination,
      },
      { condition: "ClientType", value: data.ClientType },
      {
        condition: "EmploymentContractTermType",
        value: data.EmploymentContractTermType,
      },
    ],
  }),
  PercentagePayableViaExtraInstallments: (data: ContextData) => ({
    ruleName: "PercentagePayableViaExtraInstallments",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit,
      },
      { condition: "ClientType", value: data.ClientType },
      {
        condition: "AffiliateSeniority",
        value: data.AffiliateSeniority,
      },
    ],
  }),
  IncomeSourceUpdateAllowed: (data: ContextData) => ({
    ruleName: "IncomeSourceUpdateAllowed",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit,
      },
      { condition: "ClientType", value: data.ClientType },
    ],
  }),

  LoanAmountLimit: (data: ContextData) => ({
    ruleName: "LoanAmountLimit",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit,
      },
      { condition: "ClientType", value: data.ClientType },
    ],
  }),
  LoanTermLimit: (data: ContextData) => ({
    ruleName: "LoanTermLimit",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit,
      },
      { condition: "ClientType", value: data.ClientType },
      { condition: "LoanAmount", value: data.LoanAmount },
    ],
  }),
  RiskFreeInterestRate: (data: ContextData) => ({
    ruleName: "RiskFreeInterestRate",
    conditions: [
      {
        condition: "LineOfCredit",
        value: data.LineOfCredit,
      },
      { condition: "LoanAmount", value: data.LoanAmount },
      { condition: "LoanTerm", value: data.LoanTerm },
    ],
  }),
};
