import { IFile } from "@components/modals/ListModal";

export const titleButtonTextAssited = {
  goBackText: {
    code: "Go_back_text",
    description: "Back button label",
    i18n: {
      en: "Back",
      es: "Atrás",
    },
  },
  goNextText: {
    code: "Go_next_text",
    description: "Next button label",
    i18n: {
      en: "Next",
      es: "Siguiente",
    },
  },
  submitText: {
    code: "Submit_text",
    description: "Add product button label",
    i18n: {
      en: "Add product",
      es: "Agregar producto",
    },
  },
};

export interface IStepDetails {
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
  whatsAppDial: string;
  phoneDial: string;
  whatsAppPhone: string;
  document: string;
  documentNumber: string;
  name: string;
  lastName: string;
  toggleChecked: boolean;
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
  age: string | number;
  relation: string;
  debtorDetail?: Record<string, never>;
  type?: string;
  borrowerProperties?: Record<string, never>;
}
export interface IFormData {
  contactInformation: IContactInformation;
  propertyOffered: IPropertyOffered;
  vehicleOffered: IVehicleOffered;
  borrowerData: IBorrowerData;
  bail: IBail;
  disbursementGeneral: IDisbursementGeneral;
  attachedDocuments?: {
    [key: string]: IFile[];
  };
  observations: { relevantObservations: string };
}

interface IPersonData {
  amount: number;
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
}

interface IInternalAccount extends IPersonData {
  accountNumber: string;
}

interface IExternalAccount extends IPersonData {
  bank: string;
  accountType: string;
  accountNumber: string;
}

export interface IDisbursementGeneral {
  amount: number;
  Internal_account: IInternalAccount;
  External_account: IExternalAccount;
  Certified_check: IPersonData;
  Business_check: IPersonData;
  Cash: IPersonData;
}

export interface IOptionsSelect {
  id: string;
  label: string;
  value: string;
}
export interface ICondition {
  condition: string;
  value: string | number | boolean;
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}

export type ContextData = Record<string, number | string | boolean>;

export type Rule = Irule;

export type RuleBuilder = (contextData: ContextData) => Rule;
