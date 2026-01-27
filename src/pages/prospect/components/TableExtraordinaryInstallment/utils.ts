import { removeExtraordinaryInstallments } from "@services/prospect/removeExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const removeExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
  authorizationToken: string,
) => {
  return removeExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    authorizationToken,
  );
};

export { removeExtraordinaryInstallment };
