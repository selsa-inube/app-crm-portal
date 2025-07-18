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
