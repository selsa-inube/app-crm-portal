import { IPatchOfRequirements } from "../types";

const mapRequirementsEntity = (
  data: IPatchOfRequirements,
): IPatchOfRequirements => {
  const creditRequest: IPatchOfRequirements = {
    packageId: String(data.packageId || ""),
    uniqueReferenceNumber: String(data.uniqueReferenceNumber || ""),
    packageDate: String(data.packageDate || ""),
    packageDescription: String(data.packageDescription || ""),
    modifyJustification: String(data.modifyJustification || ""),
    requirementsByPackage: Object(data.requirementsByPackage || ""),
  };
  return creditRequest;
};

export { mapRequirementsEntity };
