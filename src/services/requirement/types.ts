import { IProspect } from "../prospect/types";

export interface IValidateRequirement {
  descriptionEvaluationRequirement: string;
  requirementName: string;
  requirementStatus: string;
}

export interface IProspectValidate extends Omit<IProspect, "creditProducts"> {
  creditProducts: Record<string, string | number>[];
}

export interface IPatchValidateRequirementsPayload {
  clientIdentificationNumber: string;
  prospect: IProspectValidate | IProspect;
}
