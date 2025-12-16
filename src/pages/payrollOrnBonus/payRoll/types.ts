import { IValidateRequirement } from "@services/requirement/types";

import { IDisbursementGeneral } from "../types";

export interface StepDetails {
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
