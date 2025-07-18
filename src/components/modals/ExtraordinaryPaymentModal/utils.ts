import { IExtraordinaryInstallments } from "@services/prospect/types/extraordInaryInstallments";
import { saveExtraordinaryInstallments } from "@services/prospect/saveExtraordinaryInstallments";

const saveExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
) => {
  return saveExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
  );
};

export { saveExtraordinaryInstallment };
