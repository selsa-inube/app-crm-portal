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
  PercentagePayableViaExtraInstallments: (data) => ({
    ruleName: "PercentagePayableViaExtraInstallments",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
      {
        condition: "AffiliateSeniority",
        value: data.AffiliateSeniority,
      },
    ],
  }),
  IncomeSourceUpdateAllowed: (data) => ({
    ruleName: "IncomeSourceUpdateAllowed",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
    ],
  }),
};
