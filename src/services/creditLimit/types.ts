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

export interface IIncomeSources {
  Dividends: number;
  FinancialIncome: number;
  identificationNumber: string;
  identificationType: string;
  Leases: number;
  name: string;
  OtherNonSalaryEmoluments: number;
  PensionAllowances: number;
  PeriodicSalary: number;
  PersonalBusinessUtilities: number;
  ProfessionalFees: number;
  surname: string;
}

export interface IBorrowerProperty {
  propertyName: string;
  propertyValue: string;
}

export interface IBorrower {
  borrowerName: string;
  borrowerType: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
  borrowerProperties: IBorrowerProperty[];
}
