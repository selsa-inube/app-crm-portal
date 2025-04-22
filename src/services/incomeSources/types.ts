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

export interface BorrowerProperty {
  property_name: string;
  property_value: string;
}

export interface IBorrower {
  borrower_identification_number: string;
  borrower_identification_type: string;
  borrower_name: string;
  borrower_properties: BorrowerProperty[];
  borrower_type: string;
}
