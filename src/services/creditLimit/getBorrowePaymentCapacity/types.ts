export interface IPaymentCapacity {
  clientIdentificationNumber: string;
  dividends: number;
  financialIncome: number;
  leases: number;
  otherNonSalaryEmoluments: number;
  pensionAllowances: number;
  periodicSalary: number;
  personalBusinessUtilities: number;
  professionalFees: number;
  livingExpenseToIncomeRatio: number;
}

export interface IIncomeDetail {
  dividends: number;
  financialIncome: number;
  leases: number;
  otherNonSalaryEmoluments: number;
  pensionAllowances: number;
  periodicSalary: number;
  personalBusinessUtilities: number;
  professionalFees: number;
}

export interface IPaymentCapacityResponse {
  basicLivingExpenseReserve: number;
  livingExpenseToIncomeRatio: number;
  livingExpenseToIncomeRatiosResponse: IIncomeDetail[];
  paymentCapacity: number;
  paymentsCapacityResponse: IIncomeDetail[];
}
