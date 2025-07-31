import { getBusinessUnitsPortalStaff } from "@src/services/businessUnitsPortalStaff/SearchBusinessUnitsForAnOfficerLinpar";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

const validateBusinessUnits = async (
  publicCode: string,
  identificationDocumentNumber: string,
): Promise<IBusinessUnitsPortalStaff[]> => {
  const newData = await getBusinessUnitsPortalStaff(
    publicCode,
    identificationDocumentNumber,
  );

  return newData;
};

export { validateBusinessUnits };
