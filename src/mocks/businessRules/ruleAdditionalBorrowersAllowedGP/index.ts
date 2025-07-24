import { Irule } from "@src/pages/applyForCredit/types";

const ruleAdditionalBorrowersAllowedGPEnableQuestion = [
  {
    name: "AdditionalBorrowersAllowedGP",
    dataType: "Alphabetical",
    value: "Y",
    valueUse: "EqualTo",
    startDate: "2025-06-03T00:00:00Z",
    typeDecision: "Permanent",
    conditions: [
      {
        name: "LineOfCredit",
        dataType: "Alphabetical",
        value: "Hogar",
        valueUse: "EqualTo",
      },
      {
        name: "ClientType",
        dataType: "Alphabetical",
        value: "1",
        valueUse: "EqualTo",
      },
    ],
  },
];

const ruleAdditionalBorrowersAllowedGPDisableQuestion = [
  {
    name: "AdditionalBorrowersAllowedGP",
    dataType: "Alphabetical",
    value: "Y",
    valueUse: "EqualTo",
    startDate: "2025-06-03T00:00:00Z",
    typeDecision: "Permanent",
    conditions: [
      {
        name: "LineOfCredit",
        dataType: "Alphabetical",
        value: "Hogar",
        valueUse: "EqualTo",
      },
      {
        name: "ClientType",
        dataType: "Alphabetical",
        value: "1",
        valueUse: "EqualTo",
      },
    ],
  },
];

const ruleAdditionalBorrowersAllowedGP = (
  rule: Irule,
  generalToggleChecked: boolean,
  selectedProducts: string[],
) => {
  console.log(
    generalToggleChecked,
    "mocksRules called with rule ruleAdditionalBorrowersAllowedGP: ",
    rule,
    "logic validation ",
    !generalToggleChecked && selectedProducts.includes("Hogar"),
    "rule.conditions[0].value: ",
    rule.conditions[0].value,
    "SELECTEC PROEUCTS: ",
    selectedProducts,
  );
  if (!generalToggleChecked && selectedProducts.includes("Hogar")) {
    return ruleAdditionalBorrowersAllowedGPEnableQuestion;
  }

  return ruleAdditionalBorrowersAllowedGPDisableQuestion;
};

export { ruleAdditionalBorrowersAllowedGP };
