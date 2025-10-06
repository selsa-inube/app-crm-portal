import { IStaffPortalByBusinessManager } from "../types";

const mapResendApiToEntity = (
  resend: Record<string, string | number>,
): IStaffPortalByBusinessManager => {
  const buildResend: IStaffPortalByBusinessManager = {
    staffPortalId: String(resend.staffPortalId),
    publicCode: String(resend.publicCode),
    abbreviatedName: String(resend.abbreviatedName),
    descriptionUse: String(resend.descriptionUse),
    businessManagerCode: String(resend.businessManagerCode),
    businessManagerName: String(resend.businessManagerName),
    staffPortalCatalogCode: String(resend.staffPortalCatalogCode),
    url: String(resend.url),
    externalAuthenticationProvider: String(
      resend.externalAuthenticationProvider,
    ),
    brandImageUrl: String(resend.brandImageUrl),
  };
  return buildResend;
};

const mapResendApiToEntities = (
  resend: Record<string, string | number>[],
): IStaffPortalByBusinessManager[] => {
  return resend.map(mapResendApiToEntity);
};

export { mapResendApiToEntities, mapResendApiToEntity };
