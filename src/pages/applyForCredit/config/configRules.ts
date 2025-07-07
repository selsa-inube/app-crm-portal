import { RuleBuilder } from "../types";

export const ruleConfig: Record<string, RuleBuilder> = {
  ModeOfDisbursementType: (data) => ({
    ruleName: "ModeOfDisbursementType",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
      { condition: "LoanAmount", value: data.LoanAmount },
    ],
  }),
  ValidationGuarantee: (data) => ({
    ruleName: "HumanValidationRequirement",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
      //{ condition: "PrimaryIncomeType", value: data.PrimaryIncomeType },
      { condition: "LoanAmount", value: data.LoanAmount },
      //{ condition: "AffiliateSeniority", value: data.AffiliateSeniority },
    ],
  }),
  ValidationCoBorrower: (data) => ({
    ruleName: "HumanValidationRequirement",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      { condition: "ClientType", value: data.ClientType },
      //{ condition: "PrimaryIncomeType", value: data.PrimaryIncomeType },
      { condition: "LoanAmount", value: data.LoanAmount },
      { condition: "AffiliateSeniority", value: data.AffiliateSeniority },
    ],
  }),
  DocumentaryRequirement: (data) => ({
    ruleName: "DocumentaryRequirement",
    conditions: [
      { condition: "LineOfCredit", value: data.LineOfCredit },
      // { condition: "ClientType", value: data.ClientType },
      // { condition: "LoanAmount", value: data.LoanAmount },
      // { condition: "AffiliateSeniority", value: data.AffiliateSeniority },
    ],
  }),
};
