import { patchOfRequirements } from "@services/requirementsPackages/patchOfRequirements";
import { IPatchOfRequirements } from "@services/requirementsPackages/types";

export const saveRequirements = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequests: IPatchOfRequirements,
) => {
  let confirmationType = true;
  try {
    await patchOfRequirements(
      creditRequests,
      businessUnitPublicCode,
      businessManagerCode,
    );
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
