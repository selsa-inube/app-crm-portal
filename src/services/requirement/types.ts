import { IProspect } from "../prospect/types";

export interface IValidateRequirement {
  descriptionEvaluationRequirement: string;
  requirementName: string;
  requirementStatus: string;
}
export interface IPatchValidateRequirementsPayload {
  clientIdentificationNumber: string;
  prospect: IProspect;
}
