import { IBusinessUnit } from "@ptypes/employeePortalBusiness.types";

const mapBusinessUnitsApiToEntity = (businessUnit: Record<string, unknown>): IBusinessUnit => {
  const toStringSafe = (value: unknown): string => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    return "";
  };

  return {
    abbreviatedName: toStringSafe(businessUnit.abbreviatedName),
    businessUnitPublicCode: toStringSafe(businessUnit.businessUnitPublicCode),
    descriptionUse: toStringSafe(businessUnit.descriptionUse),
    firstMonthOfFiscalYear: toStringSafe(businessUnit.firstMonthOfFiscalYear),
    languageId: toStringSafe(businessUnit.languageId),
    urlLogo: toStringSafe(businessUnit.urlLogo),
  };
};

export { mapBusinessUnitsApiToEntity };
