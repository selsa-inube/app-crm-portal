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
  borrowers: Record<string, never>;
}

export interface IConsolidatedCreditItem {
  title: string;
  code: string;
  label: string;
  value: number;
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
  generalToggleChecked: boolean;
  togglesState: boolean[];
  loanAmountState: {
    inputValue: number | string;
    toggleChecked: boolean;
    paymentPlan: string;
    periodicity: string;
    payAmount: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  consolidatedCreditSelections: any;
  consolidatedCreditArray?: IConsolidatedCreditItem[];
}

export interface ICondition {
  condition: string;
  value: string | number;
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextData = Record<string, any>;

export type Rule = Irule;

export type RuleBuilder = (contextData: ContextData) => Rule;

export type ICreditLineTerms = {
  [line: string]: {
    LoanAmountLimit: number;
    LoanTermLimit: number;
    RiskFreeInterestRate: number;
  };
};
