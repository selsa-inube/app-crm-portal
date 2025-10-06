export interface IOptionsByStaffPortalBusinessManager {
  staffPortalId: string;
  optionCode: string;
  portalCatalogCode: string;
}

export interface IStaffPortalByBusinessManager {
  staffPortalId?: string;
  publicCode?: string;
  abbreviatedName?: string;
  descriptionUse?: string;
  businessManagerCode?: string;
  businessManagerName?: string;
  staffPortalCatalogCode?: string;
  url?: string;
  externalAuthenticationProvider?: string;
  brandImageUrl?: string;
  optionsByStaffPortalBusinessManager?: IOptionsByStaffPortalBusinessManager[];
}
