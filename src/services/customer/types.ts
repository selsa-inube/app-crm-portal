export interface IGeneralAttributeClientNaturalPersons {
  accountingClassification: string;
  associateType: string;
  birthCity: string;
  budgetExecutionUnit: string;
  cellPhoneContact: string;
  civilStatus: string;
  contractExpirationDate: string;
  contributorType: string;
  costCenter: string;
  creditReport: string;
  dateBirth: string;
  dateExpeditionIdentification: string;
  deceased: string;
  economicActivity: string;
  emailContact: string;
  employmentStartDate: string;
  employmentType: string;
  externalAccounts: string;
  firstNames: string;
  gender: string;
  hasDisability: string;
  housingType: string;
  incomeTax: string;
  lastDataUpdateDate: string;
  lastNames: string;
  notificationDispatch: string;
  numberPersonsInCharge: string;
  occupation: string;
  operationInOutside: string;
  paymentMethod: string;
  payrollDependency: string;
  payrollSection: string;
  placeExpeditionIdentification: string;
  position: string;
  profession: string;
  publicResourcesAdministration: string;
  publiclyExposed: string;
  rating: string;
  residentialAddress: string;
  residentialLocationCity: string;
  residentialPhone: string;
  responsibleOfHousehold: string;
  rhFactor: string;
  schoolingLevel: string;
  socialClass: string;
  socialSecurityRegime: string;
  subZone: string;
  subsidiary: string;
  transferAccountBank: string;
  transferAccountNumber: string;
  transferAccountType: string;
  typeIdentification: string;
  womanHeadOfHousehold: string;
  workday: string;
  workplace: string;
  zone: string;
}

export interface IgeneralAssociateAttributes {
  affiliateSeniorityDate: string;
  lastAffiliationDate: string;
  partnerStatus: string;
  payrollPublicCode: string;
}

export interface ICustomer {
  clientAssets: string;
  clientBeneficiaryContributions: string;
  clientDebts: string;
  clientFamilyGroups: string;
  clientNews: string;
  clientReferences: string;
  customerId: string;
  fullName: string;
  generalAssociateAttributes: IgeneralAssociateAttributes;
  generalAttributeClientLegalEntities: string;
  generalAttributeClientNaturalPersons: IGeneralAttributeClientNaturalPersons[];
  natureClient: string;
  periodicCustomerIncomes: string;
  publicCode: string;
}

export interface ICustomerCatalog {
  clientAssets: string;
  clientBeneficiaryContributions: string;
  clientDebts: string;
  clientFamilyGroups: string;
  clientNews: string;
  clientReferences: string;
  customerId: string;
  fullName: string;
  generalAssociateAttributes: string;
  generalAttributeClientLegalEntities: string;
  generalAttributeClientNaturalPersons: string;
  natureClient: string;
  periodicCustomerIncomes: string;
  publicCode: string;
}
