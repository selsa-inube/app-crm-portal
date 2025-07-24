import { getBusinessManagers } from "@services/businessManager";
import { IBusinessManagers } from "@services/businessManager/types";
import { IStaffPortalByBusinessManager } from "@services/staff/types";
import { getStaffPortalsByBusinessManager } from "@services/staff/staffPortal";

const validateBusinessManagers = async (
  code: string,
): Promise<IBusinessManagers> => {
  const newData = await getBusinessManagers(code);

  return newData;
};

const validateConsultation = async (): Promise<
  IStaffPortalByBusinessManager[]
> => {
  const newData = await getStaffPortalsByBusinessManager();
  return newData;
};

export { validateBusinessManagers, validateConsultation };
