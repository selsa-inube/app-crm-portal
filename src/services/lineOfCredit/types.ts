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
  additionalBorowersAllowed: string;
}

export interface IExtraInstallmentsAllowedResponse {
  extraInstallmentsAllowed: string;
}

export interface IFinancialObligationsUpdateResponse {
  financialObligationsUpdateRequired: string;
}
