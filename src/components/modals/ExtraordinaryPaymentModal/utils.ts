import { saveExtraordinaryInstallments } from "@services/iProspect/saveExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/iProspect/saveExtraordinaryInstallments/types";

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
