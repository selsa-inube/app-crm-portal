import { ruleFinancialObligationsUpdateRequired } from "./ruleFinancialObligationsUpdateRequired";
import { ruleAdditionalBorrowersAllowedGP } from "./ruleAdditionalBorrowersAllowedGP";
import { Irule } from "@src/pages/applyForCredit/types";
import { ruleIncludeExtraordinaryInstallments } from "./ruleIncludeExtraordinaryInstallments";

const mocksRules = (
  rule: Irule,
  generalToggleChecked: boolean,
  selectedProducts: string[],
) => {
  switch (rule.ruleName) {
    case "AdditionalBorrowersAllowedGP":
      return ruleAdditionalBorrowersAllowedGP(
        rule,
        generalToggleChecked,
        selectedProducts,
      );
    case "FinancialObligationsUpdateRequired":
      return ruleFinancialObligationsUpdateRequired;
    case "IncludeExtraordinaryInstallments":
      return ruleIncludeExtraordinaryInstallments(
        rule,
        generalToggleChecked,
        selectedProducts,
      );
    default:
      return [];
  }
};

export { mocksRules };
