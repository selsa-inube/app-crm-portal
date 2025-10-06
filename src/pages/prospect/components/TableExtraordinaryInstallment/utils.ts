import { removeExtraordinaryInstallments } from "@services/prospect/removeExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const removeExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
) => {
  return removeExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    businessManagerCode,
  );
};

export { removeExtraordinaryInstallment };
