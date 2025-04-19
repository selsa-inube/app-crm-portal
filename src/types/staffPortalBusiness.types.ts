import { IEmployeePortalByBusinessManager } from "./employeePortalBusiness.types";

interface IOptionsByStaffPortalBusinessManager {
  optionStaffId: string;
  staffPortalCatalogId: string;
  staffPortalId: string;
}

interface IStaffPortalByBusinessManager extends IEmployeePortalByBusinessManager {
  publicCode: string;
  url: string;
  staffPortalId: string;
  optionsByStaffPortalBusinessManager: IOptionsByStaffPortalBusinessManager[];
}

interface IStaffUserAccount {
  accountName: string;
  biologicalSex: string;
  birthDay: Date;
  principalEmail: string;
  principalPhone: string;
  userAccount: string;
  userAccountId: string;
}

export type { IStaffPortalByBusinessManager, IStaffUserAccount };
