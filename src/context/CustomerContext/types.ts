export interface ICustomerData {
  customerId: string;
  image?: string;
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
  token: string;
}

export interface ICustomerContext {
  customerData: ICustomerData;
  loadingCustomerData: boolean;
  setCustomerPublicCodeState: (publicCode: string) => void;
  setCustomerData: (data: ICustomerData) => void;
}

export const initialCustomerData: ICustomerData = {
  customerId: "",
  publicCode: "",
  fullName: "",
  natureClient: "",
  generalAttributeClientNaturalPersons: [
    {
      employmentType: "",
      associateType: "",
      typeIdentification: "",
      firstNames: "",
      lastNames: "",
      emailContact: "",
      cellPhoneContact: "",
      gender: "",
      dateBirth: "",
      zone: "",
    },
  ],
  generalAssociateAttributes: [
    {
      affiliateSeniorityDate: "",
      partnerStatus: "",
    },
  ],
  token: "",
};
