export interface IProspectSummaryById {
  [key: string]: number;
  requestedAmount: number;
  deductibleExpenses: number;
  netAmountToDisburse: number;
  totalRegularInstallments: number;
  totalConsolidatedAmount: number;
}
