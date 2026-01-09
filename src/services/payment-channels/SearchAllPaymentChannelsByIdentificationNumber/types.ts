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
  creditLine: string;
  paymentChannels: [
    {
      abbreviatedName: string;
      payingEntityName: string;
      payingIdentification: string;
      paymentChannel: string;
      regularCycles: [
        {
          cycleName: string;
          detailOfPaymentDate: [];
          firstDayOfTheCycle: string;
          paymentChannel: string;
          periodicity: string;
        },
      ];
    },
  ];
}

export interface IRegularCycle {
  cycleName: string;
  detailOfPaymentDate: string[];
  firstDayOfTheCycle: string;
  paymentChannel: string;
  periodicity: string;
}
