import { getBusinessManagers } from "@services/businessManager/SearchByIdBusinessManager";
import { IBusinessManagers } from "@services/businessManager/types";
import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import { getStaffPortalsByBusinessManager } from "@services/staff-portals-by-business-manager/SearchAllStaffPortalsByBusinessManager";

const validateBusinessManagers = async (
  code: string,
): Promise<IBusinessManagers> => {
  const newData = await getBusinessManagers(code);

  return newData;
};

const validateConsultation = async (
  staffPortalId: string,
): Promise<IStaffPortalByBusinessManager[]> => {
  const newData = await getStaffPortalsByBusinessManager(staffPortalId);
  return newData;
};

export { validateBusinessManagers, validateConsultation };
