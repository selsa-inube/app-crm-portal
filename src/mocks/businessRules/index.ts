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
        generalToggleChecked,
        selectedProducts,
      );
    case "FinancialObligationsUpdateRequired":
      return ruleFinancialObligationsUpdateRequired;
    case "IncludeExtraordinaryInstallments":
      return ruleIncludeExtraordinaryInstallments(
        generalToggleChecked,
        selectedProducts,
      );
    default:
      return [];
  }
};

export { mocksRules };
