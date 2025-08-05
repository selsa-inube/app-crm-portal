import { IObligations } from "@services/creditRequest/types";
import { Schedule } from "@services/enum/schedule";

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
  lineOfCreditDescription: string;
  creditProductCode: string;
  consolidatedAmount: number;
  consolidatedAmountType: string;
  estimatedDateOfConsolidation: Date;
}

interface IConsolidatedCreditSelections {
  title: string;
  code: string;
  label: string;
  value: number;
  totalCollected: number;
  selectedValues: Record<string, number>;
  selectedLabels?: Record<string, string>;
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
  consolidatedCreditSelections: IConsolidatedCreditSelections;
  consolidatedCreditArray?: IConsolidatedCreditItem[];
  numberOfUnmetRequirements: number;
}

export interface ICondition {
  condition: string;
  value: string | number | boolean;
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}
export type ContextData = Record<string, number | boolean | string>;

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

export interface ICreditProductProspect {
  line_of_credit_abbreviated_name: string;
  loan_amount: number;
  loan_term: number;
  interest_rate: number;
  schedule: Schedule;
  credit_product_code: string;
  fixed_points: number;
}
export interface IBorrowerPayload {
  borrower_identification_number: string;
  borrower_identification_type: string;
  borrower_name: string;
  borrower_properties: {
    property_name: string;
    property_value: string;
  }[];
  borrower_type: string;
}

export interface IConsolidatedCreditPayload {
  consolidated_amount: number;
  consolidated_amount_type: string;
  credit_product_code: string;
  estimated_date_of_consolidation: string;
  line_of_credit_description: string;
}

export interface IProspectPayload {
  bond_value: number;
  grace_period: number;
  grace_period_type: string;
  installment_limit: number;
  money_destination_abbreviated_name: string;
  preferred_payment_channel_abbreviated_name: string;
  prospect_code: string;
  prospect_id: string;
  requested_amount: number;
  selected_rate_type: string;
  selected_regular_payment_schedule: string;
  state: string;
  term_limit: number;
  time_of_creation: string;
  borrowers: IBorrowerPayload[];
  credit_products: ICreditProductProspect[];
  consolidated_credits: IConsolidatedCreditPayload[];
  outlay: [];
}

export interface IUnmetRequirementsAmountPayload {
  clientIdentificationNumber: string;
  prospect: IProspectPayload;
}

export interface IRuleData {
  ruleName: string;
  conditions: ICondition[];
}

export interface IRulesData {
  LineOfCredit: string | number;
  ClientType: string | number;
  LoanAmount: string | number;
}
