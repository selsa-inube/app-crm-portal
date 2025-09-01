interface ICondition {
  name: string;
  dataType: string;
  value: string;
  valueUse: string;
}

export interface ILinesOfCreditByMoneyDestination {
  name: string;
  dataType: string;
  value: string;
  valueUse: string;
  startDate: string;
  totalConditionsEvaluated: number;
  dataEvaluated: string[];
  typeDecision: string;
  conditions: ICondition[];
}

export interface IAdditionalBorrowersAllowedResponse {
  additionalBorowersAllowed: string;
}

export interface ICreditLineGeneralTerms {
  interestRate: number;
  loanMaxAmount: number;
  loanMaxTerm: number;
}
export interface IExtraInstallmentsAllowedResponse {
  extraInstallmentsAllowed: string;
}

export interface IFinancialObligationsUpdateResponse {
  financialObligationsUpdateRequired: string;
}
