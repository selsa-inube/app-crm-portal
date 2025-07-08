export interface ICustomerData {
  customerId: string;
  publicCode: string;
  fullName: string;
  natureClient: string;
  generalAttributeClientNaturalPersons: {
    employmentType: string;
    associateType: string;
    typeIdentification: string;
    firstNames: string;
    lastNames: string;
    emailContact: string;
    cellPhoneContact: string;
    gender: string;
    dateBirth: string;
    zone: string;
  }[];
  generalAssociateAttributes: {
    affiliateSeniorityDate: string;
    partnerStatus: string;
  }[];
}

export interface ICustomerContext {
  customerData: ICustomerData;
  setCustomerPublicCodeState: (publicCode: string) => void;
}
