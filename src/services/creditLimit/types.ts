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
  livingExpenseToIncomeRatio?: number;
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

export interface IMaximumCreditLimit {
  customerCreditLimitInLineOfCredit: number;
  customerTotalObligationsInLineOfCredit: number;
  lineOfCreditLoanAmountLimitRegulation: number;
}

export interface IMaximumCreditLimitReciprocity {
  allowedUsageCount: number;
  assignedCreditLimit: number;
  maxAmountAvailableByReciprocity: number;
  permanentSavingsBalance: number;
  unsecuredPortfolioObligation: number;
}

export interface IMaximumCreditLimitAnalysis {
  assignedCreditLimit: number;
  creditRiskMultiplier: number;
  creditRiskScore: number;
  maxAmountAvailableByCreditRiskAnalysis: number;
  totalMonthlyIncome: number;
  totalPortfolioObligation: number;
}

export interface IMaximumCreditLimitByLineOfCredit {
  creditLimitCalculationMethodAbbreviatedName: string;
  creditLimitCalculationMethodValue: number;
}

export interface IMaximumCreditLimitByMoneyDestination {
  creditLimitValue: number;
  lineOfCredit: string;
}

export interface IExtraordinaryAgreement {
  abbreviatedName: string;
  extraordinaryCycles: IExtraordinaryCycle[];
  payingEntityName: string;
  payingIdentification: string;
  payrollForDeductionAgreementCode: string;
  payrollForDeductionAgreementId: string;
}

export interface IExtraordinaryCycle {
  cycleName: string;
  extraordinaryCycleType: string;
  firstDayOfTheCycle: string;
  month: string;
  paymentDates: string[];
  payrollForDeductionAgreementCode: string;
}
