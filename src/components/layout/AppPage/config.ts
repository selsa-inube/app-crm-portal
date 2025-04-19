import { IStaffPortalByBusinessManager } from "@ptypes/staffPortalBusiness.types";
import { IBusinessManager } from "@ptypes/employeePortalBusiness.types";

export const mockDataPortal: IStaffPortalByBusinessManager = {
  abbreviatedName: "Test Name",
  businessManagerId: "12345",
  descriptionUse: "Test description",
  optionsByStaffPortalBusinessManager: [],
  publicCode: "ABC123",
  url: "https://example.com",
  businessUnit: "Test Business Unit",
  portalCode: "TestPortalCode",
  employeePortalCatalogId: "EPC123",
  employeePortalId: "EP123",
  staffPortalId: "SP123",
};
export const mockBusinessManagersData: IBusinessManager = {
  id: "1",
  publicCode: "BM001",
  language: "es",
  abbreviatedName: "Gerente 1",
  description: "Gerente de ventas",
  urlBrand: "https://example.com/brand.png",
  urlLogo: "https://example.com/logo.png",
  customerId: "C001",
};

export const mockBusinessUnitsData = [
  {
    abbreviatedName: "BU001",
    businessUnitPublicCode: "BU001",
    descriptionUse: "Unidad de ventas",
    firstMonthOfFiscalYear: "01",
    languageId: "es",
    urlLogo: "https://example.com/unit-logo.png",
  },
];
