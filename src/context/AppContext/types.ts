import { SectionOrientation } from "@components/layout/BoardSection/types";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

interface IPortal {
  abbreviatedName: string;
  staffPortalCatalogId: string;
  businessManagerId: string;
  publicCode: string;
}
interface IBusinessManager {
  publicCode: string;
  abbreviatedName: string;
  urlBrand: string;
  urlLogo: string;
}
interface IPreferences {
  boardOrientation: SectionOrientation;
  showPinnedOnly: boolean;
}

interface IStaffByBusinessUnitAndRole {
  businessUnitCode: string;
  roleName: string;
  staffId: string;
}

interface IStaff {
  biologicalSex: string;
  birthDay: string;
  businessManagerCode: string;
  identificationDocumentNumber: string;
  identificationTypeNaturalPerson: string;
  missionName: string;
  principalEmail: string;
  principalPhone: string;
  staffByBusinessUnitAndRole: IStaffByBusinessUnitAndRole;
  staffId: string;
  staffName: string;
  userAccount: string;
}

interface IUser {
  userAccount: string;
  userName: string;
  staff: IStaff;
  preferences: IPreferences;
}

interface IBusinessUnit {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  urlLogo: string;
  languageId: string;
  descriptionUse?: string;
  firstMonthOfFiscalYear?: string;
}
interface ICrediboardData {
  portal: IPortal;
  businessManager: IBusinessManager;
  businessUnit: IBusinessUnit;
  user: IUser;
}

interface IAppContext {
  eventData: ICrediboardData;
  businessUnitSigla: string;
  businessUnitsToTheStaff: IBusinessUnitsPortalStaff[];
  setEventData: React.Dispatch<React.SetStateAction<ICrediboardData>>;
  setBusinessUnitSigla: React.Dispatch<React.SetStateAction<string>>;
  setBusinessUnitsToTheStaff: React.Dispatch<
    React.SetStateAction<IBusinessUnitsPortalStaff[]>
  >;
}

export type { ICrediboardData, IAppContext, IBusinessUnit, IPreferences };
