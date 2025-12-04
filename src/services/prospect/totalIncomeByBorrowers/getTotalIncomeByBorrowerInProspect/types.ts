export interface IIncomeDetails {
  incomeType: string;
  incomeValue: number;
}

export interface IIncomeSourceBorrowers {
  borrowerType: string;
  borrowerIdentificationNumber: string;
  totalIncome: number;
  primaryIncomeType: string;
  income: IIncomeDetails[];
}
