import { IValidateRequirement } from "@services/requirement/types";

export const titleButtonTextAssited = {
  goBackText: "Anterior",
  goNextText: "Siguiente",
  submitText: "Enviar",
};
export interface IDisbursementGeneral {
  amount: number;
  Internal_account: IInternalAccount;
  External_account: IExternalAccount;
  Certified_check: IPersonData;
  Business_check: IPersonData;
  Cash: IPersonData;
}
interface IExternalAccount extends IPersonData {
  bank: string;
  accountType: string;
  accountNumber: string;
}
interface IInternalAccount extends IPersonData {
  accountNumber: string;
}
interface IPersonData {
  amount: number;
  check: boolean;
  toggle: boolean;
  accountLabel?: string;
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

export interface IStepDetails {
  id: number;
  number: number;
  name: string;
  description: string;
}

export interface IBonusFormData {
  requestedValue: string;
  disbursementGeneral: IDisbursementGeneral;
  requirementsValidation?: {
    requirements: IValidateRequirement[];
    isValid: boolean;
    validatedAt: Date | null;
    unfulfilledCount: number;
  };
}

export interface IStep {
  id: number;
  description: string;
  number?: number;
  name?: string;
}

export interface IProspectSummaryById {
  [key: string]: number;
  requestedAmount: number;
  deductibleExpenses: number;
  netAmountToDisburse: number;
  totalRegularInstallments: number;
  totalConsolidatedAmount: number;
}
