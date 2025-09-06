import { encrypt } from "@utils/encrypt/encrypt";
import { IBusinessManagers } from "../types";

const mapBusinessManagerApiToEntity = (
  businessManager: Record<string, unknown>,
): IBusinessManagers => {
  const toStringSafe = (value: unknown): string => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    return "";
  };

  const clientId = toStringSafe(businessManager.clientId);
  const clientSecret = toStringSafe(businessManager.clientSecret);

  const business: IBusinessManagers = {
    id: toStringSafe(businessManager.businessManagerId),
    publicCode: toStringSafe(businessManager.publicCode),
    language: toStringSafe(businessManager.languageId),
    abbreviatedName: toStringSafe(businessManager.abbreviatedName),
    description: toStringSafe(businessManager.descriptionUse),
    urlBrand: toStringSafe(businessManager.urlBrand),
    urlLogo: toStringSafe(businessManager.urlLogo),
    customerId: toStringSafe(businessManager.customerId),
    clientId: clientId ? encrypt(clientId) : "",
    clientSecret: clientSecret ? encrypt(clientSecret) : "",
  };

  return business;
};

export { mapBusinessManagerApiToEntity };
