import { IExtraordinaryInstallments } from "../types";

const mapExtraordinaryInstallmentsEntity = (
  data: IExtraordinaryInstallments,
): IExtraordinaryInstallments => {
  const creditRequest: IExtraordinaryInstallments = {
    creditProductCode: String(data.creditProductCode || ""),
    extraordinaryInstallments: Object(data.extraordinaryInstallments || ""),
    prospectId: String(data.prospectId || ""),
  };
  return creditRequest;
};

export { mapExtraordinaryInstallmentsEntity };
