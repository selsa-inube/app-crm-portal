import { IProspect } from "../types";

interface IValidateRequirement {
  unmetRequirementsAmount: number;
}
interface IUnmetRequirementsAmount {
  clientIdentificationNumber: string;
  prospect: IProspect;
}

export type { IValidateRequirement, IUnmetRequirementsAmount };
