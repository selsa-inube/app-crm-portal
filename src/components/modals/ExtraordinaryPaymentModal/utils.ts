import { addExtraordinaryInstallments } from "@services/prospect/addExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const saveExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
  authorizationToken: string,
) => {
  return addExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    authorizationToken,
  );
};

export { saveExtraordinaryInstallment };
