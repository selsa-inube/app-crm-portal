import { addExtraordinaryInstallments } from "@services/prospect/addExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const saveExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
) => {
  return addExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
  );
};

export { saveExtraordinaryInstallment };
