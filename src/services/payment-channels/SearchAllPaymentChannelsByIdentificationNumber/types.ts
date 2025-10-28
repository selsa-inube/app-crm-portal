export interface IPaymentDatesChannel {
  Dividends: number;
  FinancialIncome: number;
  Leases: number;
  OtherNonSalaryEmoluments: number;
  PensionAllowances: number;
  PeriodicSalary: number;
  PersonalBusinessUtilities: number;
  ProfessionalFees: number;
  clientIdentificationNumber: string;
  clientIdentificationType: string;
  linesOfCredit: string[];
  moneyDestination: string;
}

export interface IResponsePaymentDatesChannel {
  abbreviatedName: string;
  payingEntityName: string;
  payingIdentification: string;
  paymentChannel: string;
  regularCycles: IRegularCycle[];
}

export interface IRegularCycle {
  cycleName: string;
  detailOfPaymentDate: string[];
  firstDayOfTheCycle: string;
  paymentChannel: string;
  periodicity: string;
}
