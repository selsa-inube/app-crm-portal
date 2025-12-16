import { IObligations } from "@services/creditRequest/types";
import { IBorrower } from "@services/prospect/types";
import { IValidateRequirement } from "@services/requirement/types";

import { IDisbursementGeneral } from "../payrollOrnBonus/types";
import { TableExtraordinaryInstallmentProps } from "../prospect/components/TableExtraordinaryInstallment";

export const titleButtonTextAssited = {
  goBackText: "Anterior",
  goNextText: "Siguiente",
  submitText: "Enviar",
};

export interface StepDetails {
  id: number;
  number: number;
  name: string;
  description: string;
}

export interface IManageErrors {
  validateRequirements?: boolean;
}

export interface IStep {
  id: number;
  description: string;
  number?: number;
  name?: string;
}

export interface IOptionInitialiceEntry {
  id: string;
  value: string;
  isActive: boolean;
}

export interface IActions {
  [key: string]: React.ReactNode;
}

export interface IAction {
  id: string;
  actionName: string;
  content: (entry: IActions) => React.ReactNode;
}

export interface IPosition {
  [key: string]: React.ReactNode;
  Codigo: string;
  "Fecha-solicitud": string;
  Destino: string;
  Valor: string;
  Acciones?: string;
  n_roles?: string[];
}

export interface StepDetails {
  id: number;
  number: number;
  name: string;
  description: string;
}

export interface LoanConditionState {
  toggles: {
    quotaCapToggle: boolean;
    maximumTermToggle: boolean;
  };
  quotaCapValue: string;
  maximumTermValue: string;
}

export interface LoanAmountState {
  inputValue: string;
  toggleChecked: boolean;
  paymentPlan: string;
}

export interface IBorrowerData {
  borrowers: IBorrower[];
}

export interface IConsolidatedCreditItem {
  lineOfCreditDescription: string;
  creditProductCode: string;
  consolidatedAmount: number;
  consolidatedAmountType: string;
  estimatedDateOfConsolidation: Date;
}
export interface ISourcesOfIncomeState {
  Dividends: number;
  FinancialIncome: number;
  Leases: number;
  OtherNonSalaryEmoluments: number;
  PensionAllowances: number;
  PeriodicSalary: number;
  PersonalBusinessUtilities: number;
  ProfessionalFees: number;
  identificationNumber: string;
  identificationType: string;
  name: string;
  surname: string;
}
export interface IFormData {
  selectedDestination: string;
  selectedProducts: string[];
  loanConditionState: {
    toggles: {
      quotaCapToggle: boolean;
      maximumTermToggle: boolean;
    };
    quotaCapValue: string | number;
    maximumTermValue: string | number;
  };
  borrowerData: IBorrowerData;
  obligationsFinancial: IObligations | null;
  generalToggleChecked: boolean;
  togglesState: boolean[];
  extraordinaryInstallments: TableExtraordinaryInstallmentProps[];
  loanAmountState: {
    inputValue: number | string;
    toggleChecked: boolean;
    paymentPlan: string;
    periodicity: string;
    payAmount: string;
  };
  consolidatedCreditSelections: {
    title: string;
    code: string;
    label: string;
    value: number;
    totalCollected: number;
    selectedValues: Record<string, number>;
    selectedLabels?: Record<string, string>;
  };
  consolidatedCreditArray?: IConsolidatedCreditItem[];
  sourcesOfIncome: ISourcesOfIncomeState;
  riskScore: {
    value: number;
    date: string;
  };
  requestedValue?: string;
  disbursementGeneral?: IDisbursementGeneral;
  requirementsValidation?: {
    requirements: IValidateRequirement[];
    isValid: boolean;
    validatedAt: Date | null;
    unfulfilledCount: number;
  };
}

export interface ICondition {
  condition: string;
  value: string | number | boolean;
}

export interface IServicesProductSelection {
  financialObligation: string[];
  aditionalBorrowers: string[];
  extraInstallement: string[];
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}

export type ContextData = Record<string, number | string>;

export type Rule = Irule;

export type RuleBuilder = (contextData: ContextData) => Rule;

export type ICreditLineTerms = {
  [line: string]: {
    LoanAmountLimit: number;
    LoanTermLimit: number;
    RiskFreeInterestRate: number;
  };
};

export type RuleValue = string | { value: string } | undefined;
