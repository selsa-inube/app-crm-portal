export interface DocumentItem {
  creditRequestId: string;
  documentId: string;
  documentManagmentReference: string;
  abbreviatedName: string;
  fileName: string;
}

interface IRequirementByPackage {
  requirementPackageId: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  requirementTypeToEvaluate: string;
  statusChangeJustification?: string;
}
export interface IRequirementsByBusinessUnit {
  requirementByBusinessUnitId: string;
  requirementName: string;
  validationCode: string;
  requirementType: string;
  humanValidationCode: string;
  documentCode: string;
}

export interface IRequirement {
  packageId: string;
  packageDate: string;
  uniqueReferenceNumber: string;
  requirementsByPackage: IRequirementByPackage[];
}

type RequirementStatus = string;

export type RequirementType =
  | "SYSTEM_VALIDATION"
  | "DOCUMENT"
  | "HUMAN_VALIDATION";

export type MappedRequirements = {
  credit_request_id: string;
  SYSTEM_VALIDATION: Record<string, RequirementStatus>;
  DOCUMENT: Record<string, RequirementStatus>;
  HUMAN_VALIDATION: Record<string, RequirementStatus>;
};
