export const titleButtonTextAssited = {
  goBackText: "Anterior",
  goNextText: "Siguiente",
  submitText: "Radicar",
};

export interface StepDetails {
  id: number;
  number: number;
  name: string;
  description: string;
}

export interface IStep {
  id: number;
  description: string;
  number?: number;
  name?: string;
}

export interface IContactInformation {
  email: string;
  phone: string;
  document: string;
  documentNumber: string;
  name: string;
  lastName: string;
}

export interface IVehicleOffered {
  state: string;
  model: string;
  value: string;
  description: string;
}
export interface IPropertyOffered {
  antique: string;
  estimated: string;
  type: string;
  state: string;
  description: string;
}
export interface IBorrowerData {
  borrowers: Record<string, never>;
  initialBorrowers: {
    id: string;
    name: string;
    debtorDetail: {
      age: string;
      document: string;
      documentNumber: string;
      email: string;
      lastName: string;
      name: string;
      number: string;
      relation: string;
      sex: string;
    };
  };
}
export interface IBail {
  client: boolean;
}

export interface IDebtorDetail {
  document: string;
  documentNumber: string;
  name: string;
  lastName: string;
  email: string;
  number: string;
  sex: string;
  age: string;
  relation: string;
}

export interface FormData {
  contactInformation: IContactInformation;
  propertyOffered: IPropertyOffered;
  vehicleOffered: IVehicleOffered;
  borrowerData: IBorrowerData;
  bail: IBail;
  disbursementGeneral: IDisbursementGeneral;
  attachedDocuments?: {
    [key: string]: { id: string; name: string; file: File }[];
  };
}

export interface IDisbursementGeneral {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  Internal: {
    amount: string;
    check: boolean;
    toggle: boolean;
    account: string;
    description: string;
    name: string;
    lastName: string;
    sex: string;
    documentType: string;
    identification: string;
    birthdate: string;
    phone: string;
    mail: string;
    city: string;
  };
  External: {
    amount: string;
    check: boolean;
    toggle: boolean;
    bank: string;
    accountType: string;
    accountNumber: string;
    description: string;
    name: string;
    lastName: string;
    sex: string;
    documentType: string;
    identification: string;
    birthdate: string;
    phone: string;
    mail: string;
    city: string;
  };
  CheckEntity: {
    amount: string;
    check: boolean;
    toggle: boolean;
    description: string;
    name: string;
    lastName: string;
    sex: string;
    documentType: string;
    identification: string;
    birthdate: string;
    phone: string;
    mail: string;
    city: string;
  };
  CheckManagement: {
    amount: string;
    check: boolean;
    toggle: boolean;
    description: string;
    name: string;
    lastName: string;
    sex: string;
    documentType: string;
    identification: string;
    birthdate: string;
    phone: string;
    mail: string;
    city: string;
  };
  Cash: {
    amount: string;
    check: boolean;
    toggle: boolean;
    description: string;
    name: string;
    lastName: string;
    sex: string;
    documentType: string;
    identification: string;
    birthdate: string;
    phone: string;
    mail: string;
    city: string;
  };
}

export interface IOptionsSelect {
  id: string;
  label: string;
  value: string;
}
export interface ICondition {
  condition: string;
  value: string | number;
}

export interface IDocumentUpload {
  id: string;
  name: string;
  file: File;
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextData = Record<string, any>;

export type Rule = Irule;

export type RuleBuilder = (contextData: ContextData) => Rule;
