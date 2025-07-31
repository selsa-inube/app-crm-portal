import { getBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/SearchBusinessUnitsForAnOfficerLinpar";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

const validateBusinessUnits = async (
  portalPublicCode: string,
  identificationDocumentNumber: string,
): Promise<IBusinessUnitsPortalStaff[]> => {
  const newData = await getBusinessUnitsPortalStaff(
    portalPublicCode,
    identificationDocumentNumber,
  );

  return newData;
};

export { validateBusinessUnits };
