import { saveExtraordinaryInstallments } from "@services/prospect/saveExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@src/services/prospect/types";

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
