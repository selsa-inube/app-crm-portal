import { saveExtraordinaryInstallments } from "@services/prospect/saveExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const saveExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
) => {
  return saveExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    businessManagerCode,
  );
};

export { saveExtraordinaryInstallment };
