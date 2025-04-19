import { IBusinessManager } from "@ptypes/employeePortalBusiness.types";

const mapBusinessManagerApiToEntity = (
  businessManager: Record<string, unknown>,
): IBusinessManager => {
  const toStringSafe = (value: unknown): string => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    return "";
  };

  const business: IBusinessManager = {
    id: toStringSafe(businessManager.businessManagerId),
    publicCode: toStringSafe(businessManager.publicCode),
    language: toStringSafe(businessManager.languageId),
    abbreviatedName: toStringSafe(businessManager.abbreviatedName),
    description: toStringSafe(businessManager.descriptionUse),
    urlBrand: toStringSafe(businessManager.urlBrand),
    urlLogo: toStringSafe(businessManager.urlLogo),
    customerId: toStringSafe(businessManager.customerId),
  };
  return business;
};

export { mapBusinessManagerApiToEntity };
