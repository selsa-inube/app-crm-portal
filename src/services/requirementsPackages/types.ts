interface IlistsOfRequirements {
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  typeOfRequirementToEvaluate: string;
  transactionOperation: string;
}

export interface ITracesInRequirementsManagement {
  assignedStatus: string;
  justificationForChangeOfStatus: string;
  packageId: string;
  requirementPackageId: string;
  traceDate: string;
  traceId: string;
}

interface IRequirementByPackage {
  requirementByPackageId: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  typeOfRequirementToEvaluate: string;
  statusChangeJustification?: string;
}

export interface IPackagesOfRequirementsById {
  packageId: string;
  packageDate: string;
  uniqueReferenceNumber: string;
  packageDescription: string;
  requirementsByPackage: IRequirementByPackage[];
}

export interface IPatchOfRequirements {
  packageId: string;
  uniqueReferenceNumber: string;
  packageDate: string;
  packageDescription: string;
  modifyJustification?: string;
  requirementsByPackage: IlistsOfRequirements[];
}
