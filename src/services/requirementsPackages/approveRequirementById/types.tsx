interface IDocumentsByRequirement {
  documentCode: string;
  requirementByPackageId: string;
  transactionOperation: string;
}

export interface IapproveRequirement {
  modifyJustification: string;
  nextStatusValue: string;
  packageId: string;
  requirementByPackageId: string;
  statusChangeJustification: string;
  transactionOperation: string;
  documentsByRequirement: IDocumentsByRequirement[];
}

interface IRequirementsByPackage {
  requirementByPackageId: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  typeOfRequirementToEvaluate: string;
  statusChangeJustification: string;
  transactionOperation: string;
}

export interface IapproveRequirementResponse {
  packageId: string;
  requirementsByPackage: IRequirementsByPackage[];
}
