import { IProspect } from "@services/prospect/types";

interface IValidateRequirement {
  unmetRequirementsAmount: number;
}
interface IUnmetRequirementsAmount {
  clientIdentificationNumber: string;
  prospect: IProspect;
}

export type { IValidateRequirement, IUnmetRequirementsAmount };
