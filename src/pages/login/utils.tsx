import { getBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

const validateBusinessUnits = async (
  publicCode: string,
  userAccount: string,
): Promise<IBusinessUnitsPortalStaff[]> => {
  const newData = await getBusinessUnitsPortalStaff(publicCode, userAccount);

  return newData;
};

export { validateBusinessUnits };
