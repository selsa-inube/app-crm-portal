interface IBusinessManagers {
  id: string;
  publicCode: string;
  language: string;
  abbreviatedName: string;
  description: string;
  urlBrand: string;
  urlLogo: string;
  customerId: string;
  clientId: string;
  clientSecret: string;
}

interface IOptionsByEmployeePortalBusinessManager {
  optionEmployeeId: string;
  employeePortalCatalogId: string;
  employeePortalId: string;
}

interface IEmployeePortalByBusinessManager {
  abbreviatedName: string;
  businessManagerId: string;
  businessUnit: string;
  descriptionUse: string;
  portalCode: string;
  employeePortalCatalogId: string;
  employeePortalId: string;
  optionsByEmployeePortalBusinessManager?: IOptionsByEmployeePortalBusinessManager[];
  externalAuthenticationProvider: string;
}

export type { IBusinessManagers, IEmployeePortalByBusinessManager };
