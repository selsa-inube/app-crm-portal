export interface ILinesOfCreditByMoneyDestination {
  abbreviateName: string;
  amortizationType: string[];
  description: string;
  maxAmount: number;
  maxEffectiveInterestRate: number;
  maxTerm: number;
  minAmount: number;
  minEffectiveInterestRate: number;
  minTerm: number;
}

export interface IAdditionalBorrowersAllowedResponse {
  additionalBorrowersAllowed: string;
}

export interface IExtraInstallmentsAllowedResponse {
  extraInstallmentsAllowed: string;
}

export interface IFinancialObligationsUpdateResponse {
  financialObligationsUpdateRequired: string;
}

export interface ISearchAllModesOfDisbursementTypes {
  modesOfDisbursementTypes: string[];
}

export interface CreditLineGeneralTerms {
  abbreviateName: string;
  description: string;
  minTerm: number;
  maxTerm: number;
  minAmount: number;
  maxAmount: number;
  minEffectiveInterestRate: number;
  maxEffectiveInterestRate: number;
  amortizationType: string[];
}

export interface IMaximumNotificationDocumentSize {
  maximumNotificationDocumentSize: number;
}
