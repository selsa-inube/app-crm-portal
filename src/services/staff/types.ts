export interface IStaffByBusinessUnitAndRole {
  businessUnitCode: string;
  roleName: string;
  staffId: string;
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
}

export interface IoptionsByStaffPortalBusinessManager {
  optionStaffId: string;
  staffPortalCatalogId: string;
  staffPortalId: string;
}

export interface IStaffPortalByBusinessManager {
  abbreviatedName?: string;
  businessManagerId?: string;
  descriptionUse?: string;
  optionsByStaffPortalBusinessManager?: IoptionsByStaffPortalBusinessManager[];
  publicCode?: string;
  staffPortalCatalogId?: string;
  staffPortalId?: string;
  url?: string;
}
