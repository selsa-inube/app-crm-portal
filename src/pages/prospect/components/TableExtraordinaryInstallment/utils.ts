import { removeExtraordinaryInstallments } from "@services/iProspect/removeExtraordinaryInstallments";
import { updateExtraordinaryInstallments } from "@services/iProspect/updateExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/iProspect/removeExtraordinaryInstallments/types";

const removeExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
) => {
  return removeExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
  );
};

const updateExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
) => {
  return updateExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
  );
};

export { removeExtraordinaryInstallment, updateExtraordinaryInstallment };
