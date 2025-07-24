import { Irule } from "@src/pages/applyForCredit/types";

const ruleIncludeExtraordinaryInstallmentsEnableQuestion = [
  {
    name: "IncludeExtraordinaryInstallments",
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

const ruleIncludeExtraordinaryInstallmentsDisableQuestion = [
  {
    name: "IncludeExtraordinaryInstallments",
    dataType: "Alphabetical",
    value: "N",
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

const ruleIncludeExtraordinaryInstallments = (
  rule: Irule,
  generalToggleChecked: boolean,
  selectedProducts: string[],
) => {
  console.log(
    generalToggleChecked,
    "mocksRules called with rule ruleIncludeExtraorggggggggdinaryInstallments: ",
    rule,
    "logic validation ",
    !generalToggleChecked && selectedProducts.includes("Hogar"),
    "rule.conditions[0].value: ",
    rule.conditions[0].value,
    "SELECTEC PROEUCTS: ",
    selectedProducts,
  );
  if (!generalToggleChecked && selectedProducts.includes("Hogar")) {
    return ruleIncludeExtraordinaryInstallmentsEnableQuestion;
  }

  return ruleIncludeExtraordinaryInstallmentsDisableQuestion;
};

export { ruleIncludeExtraordinaryInstallments };
