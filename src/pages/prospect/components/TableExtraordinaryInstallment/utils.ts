import { removeExtraordinaryInstallments } from "@services/prospect/removeExtraordinaryInstallments";
import { updateExtraordinaryInstallments } from "@services/prospect/updateExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

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
