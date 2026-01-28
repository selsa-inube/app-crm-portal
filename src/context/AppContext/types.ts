import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";

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
  businessManagerId?: string;
}

interface IStaffByBusinessUnitAndRole {
  businessUnitCode: string;
  roleName: string;
  staffId: string;
}

export interface Ipermissions {
  canReject: boolean;
  canCancel: boolean;
  canPrint: boolean;
  canAttach: boolean;
  canViewAttachments: boolean;
  canManageGuarantees: boolean;
  canViewCreditProfile: boolean;
  canManageDisbursementMethods: boolean;
  canAddRequirements: boolean;
  canSendDecision: boolean;
  canChangeUsers: boolean;
  canApprove: boolean;
  canSubmitProspect: boolean;
  identificationDocumentNumber?: string;
}
export interface IStaff {
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
  useCases: string[];
}

interface IUser {
  userAccount: string;
  userName: string;
  identificationDocumentNumber?: string;
  staff: IStaff;
}
export interface IUsers {
  username: string;
  id: string;
  company: string;
  urlImgPerfil: string;
  nickname: string;
}
interface IBusinessUnit {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  urlLogo: string;
  languageId: string;
  languageiso: string;
  descriptionUse?: string;
  firstMonthOfFiscalYear?: string;
}
interface ICRMPortalData {
  portal: IPortal;
  businessManager: IBusinessManager;
  businessUnit: IBusinessUnit;
  user: IUser;
}

interface IAppContext {
  eventData: ICRMPortalData;
  businessUnitSigla: string;
  businessUnitsToTheStaff: IBusinessUnitsPortalStaff[];
  setEventData: React.Dispatch<React.SetStateAction<ICRMPortalData>>;
  setBusinessUnitSigla: React.Dispatch<React.SetStateAction<string>>;
  setBusinessUnitsToTheStaff: React.Dispatch<
    React.SetStateAction<IBusinessUnitsPortalStaff[]>
  >;
  setOptionStaffData: React.Dispatch<React.SetStateAction<IOptionStaff[]>>;
  optionStaffData?: IOptionStaff[];
  loadingEventData?: boolean;
}

export type { ICRMPortalData, IAppContext, IBusinessUnit };
