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

export interface IConsolidatedCredit {
  creditProductCode: string;
  consolidatedAmount: number;
  consolidatedAmountType: string;
  estimatedDateOfConsolidation: Date;
  lineOfCreditDescription: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
}

export interface IOrdinaryInstallmentsForPrincipal {
  numberOfInstallments: number;
  schedule: string;
  installmentAmountForCapital: number;
  installmentAmount: number;
  gradientRate: number;
  gradientValue: number;
  gradientSchedule: string;
  firstGradientDate: Date;
  paymentChannelAbbreviatedName: string;
}

export interface IInstallmentsForInterest {
  schedule: string;
  paymentChannelAbbreviatedName: string;
}

export interface IExtraordinaryInstallment {
  id?: string;
  installmentDate: Date | string;
  installmentAmount: number;
  paymentChannelAbbreviatedName: string;
}

export interface IExtraordinaryInstallments {
  creditProductCode: string;
  extraordinaryInstallments: IExtraordinaryInstallment[];
  prospectId: string;
}

export interface IAcquiredCashFlow {
  amount: string;
  date: Date;
  paymentChannelAbbreviatedName: string;
  flowNumber: number;
}

export interface ICreditProduct {
  creditProductCode: string;
  loanAmount: number;
  lineOfCreditAbbreviatedName: string;
  interestRate: number;
  fixedPoints: number;
  loanTerm: number;
  schedule: string;
  ordinaryInstallmentsForPrincipal: IOrdinaryInstallmentsForPrincipal[];
  installmentsForInterest: IInstallmentsForInterest[];
  extraordinaryInstallments: IExtraordinaryInstallment[];
  acquiredCashFlows: IAcquiredCashFlow[];
}

export interface IOutlay {
  date: Date;
  amount: number;
}
export interface IProspect {
  prospectId: string;
  prospectCode: string;
  state: string;
  requestedAmount: number;
  installmentLimit: number;
  termLimit: number;
  timeOfCreation: Date;
  selectedRegularPaymentSchedule: string;
  selectedRateType: string;
  preferredPaymentChannelAbbreviatedName: string;
  gracePeriod: number;
  gracePeriodType: string;
  moneyDestinationAbbreviatedName: string;
  bondValue: number;
  borrowers: IBorrower[];
  consolidatedCredits: IConsolidatedCredit[];
  creditProducts: ICreditProduct[];
  outlays: IOutlay[];
}

export interface IAddCreditProduct {
  creditProducts: [
    {
      lineOfCreditAbbreviatedName: string;
    },
  ];
  prospectId: string;
}

export interface IRemoveCreditProduct {
  creditProductCode: string;
  prospectId: string;
}

export interface IUpdateCreditProduct {
  creditProductCode: string;
  interestRate: number;
  loanTerm: number;
  prospectId: string;
}

export interface IAllDeductibleExpensesById {
  expenseName: string;
  expenseValue: number;
}

export interface IProspectSummaryById {
  [key: string]: number;
  requestedAmount: number;
  deductibleExpenses: number;
  netAmountToDisburse: number;
  totalRegularInstallments: number;
  totalConsolidatedAmount: number;
}

export interface IShareCreditProspect {
  clientName: string;
  email: string;
  prospectId: string;
  optionalEmail: string;
  file: File | null;
}
export interface IShareCreditProspectResponse {
  codeNotification: string;
}
