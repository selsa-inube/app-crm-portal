import { IStaffPortalByBusinessManager } from "@ptypes/staffPortalBusiness.types";

const mapStaffPortalByBusinessManagerApiToEntity = (
  resend: Record<string, string | number | object>,
): IStaffPortalByBusinessManager => {
  const buildResend: IStaffPortalByBusinessManager = {
    abbreviatedName: typeof resend.abbreviatedName === "string" ? resend.abbreviatedName : "",
    businessManagerId: typeof resend.businessManagerId === "string" ? resend.businessManagerId : "",
    descriptionUse: typeof resend.descriptionUse === "string" ? resend.descriptionUse : "",
    publicCode: typeof resend.publicCode === "string" ? resend.publicCode : "",
    staffPortalId: typeof resend.staffPortalId === "string" ? resend.staffPortalId : "",
    url: typeof resend.url === "string" ? resend.url : "",
    businessUnit: typeof resend.businessUnit === "string" ? resend.businessUnit : "",
    portalCode: typeof resend.portalCode === "string" ? resend.portalCode : "",
    employeePortalCatalogId:
      typeof resend.employeePortalCatalogId === "string" ? resend.employeePortalCatalogId : "",
    employeePortalId: typeof resend.employeePortalId === "string" ? resend.employeePortalId : "",
    optionsByStaffPortalBusinessManager: Array.isArray(resend.optionsByStaffPortalBusinessManager)
      ? resend.optionsByStaffPortalBusinessManager.map((option) => ({
          optionStaffId: typeof option.optionStaffId === "string" ? option.optionStaffId : "",
          staffPortalCatalogId:
            typeof option.staffPortalCatalogId === "string" ? option.staffPortalCatalogId : "",
          staffPortalId: typeof option.staffPortalId === "string" ? option.staffPortalId : "",
        }))
      : [],
  };

  return buildResend;
};

const mapStaffPortalByBusinessManagerApiToEntities = (
  resend: Record<string, string | number | object>[],
): IStaffPortalByBusinessManager[] => {
  return resend.map(mapStaffPortalByBusinessManagerApiToEntity);
};

export { mapStaffPortalByBusinessManagerApiToEntities, mapStaffPortalByBusinessManagerApiToEntity };
