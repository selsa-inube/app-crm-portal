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
  installmentFrequency: string;
  installmentAmountForCapital: number;
  installmentAmount: number;
  gradientRate: number;
  gradientValue: number;
  gradientFrequency: string;
  firstGradientDate: Date;
  paymentChannelAbbreviatedName: string;
  humanChannelPaymentDay: number;
}

export interface IInstallmentsForInterest {
  humanChannelPaymentDay: number;
  installmentFrequency: string;
  paymentChannelAbbreviatedName: string;
}

export interface IExtraordinaryInstallment {
  id?: string;
  installmentDate: Date | string;
  installmentAmount: number;
  paymentChannelAbbreviatedName: string;
  humanChannelPaymentDay?: number;
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
  humanChannelPaymentDay: number;
  flowNumber: number;
}

export interface ICreditProduct {
  creditProductCode: string;
  loanAmount: number;
  lineOfCreditAbbreviatedName: string;
  installmentFrequency: string;
  interestRateDueType: string;
  interestRate: number;
  schedule: string;
  fixedPoints: number;
  loanTerm: number;
  ordinaryInstallmentsForPrincipal: IOrdinaryInstallmentsForPrincipal[];
  installmentsForInterest: IInstallmentsForInterest[];
  extraordinaryInstallments: IExtraordinaryInstallment[];
  acquiredCashFlows: IAcquiredCashFlow[];
  referenceIndexForVariableInterestRate: string;
}

export interface IOutlay {
  date: Date;
  amount: number;
}
export interface ISimulateLineOfCredit {
  lineOfCreditAbbreviatedName: string;
}
export interface ISimulateExtraordinaryInstallment {
  installmentAmount: number;
  installmentDate: string | Date;
  paymentChannelAbbreviatedName: string;
}

export interface IProspect {
  prospectId: string;
  prospectCode: string;
  state: string;
  requestedAmount: number | string;
  timeOfCreation?: Date;
  selectedRegularPaymentSchedule: string;
  selectedRateType: string;
  preferredPaymentChannelAbbreviatedName: string;
  gracePeriod: number;
  gracePeriodType?: string;
  moneyDestinationAbbreviatedName: string;
  bondValue: number;
  clientComments: string;
  creditScore: string;
  modifyJustification?: string;
  clientManagerIdentificationNumber: string;
  clientManagerName: string;
  clientManagerObservation: string;
  borrowers: IBorrower[];
  consolidatedCredits: IConsolidatedCredit[];
  linesOfCredit?: ISimulateLineOfCredit[] | string[];
  firstPaymentCycleDate?: string;
  extraordinaryInstallments?: ISimulateExtraordinaryInstallment[];
  creditProducts: ICreditProduct[];
  outlays: IOutlay[];
  termLimit?: number | string;
  installmentLimit?: number | string;
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

export interface IProspectBorrower {
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
  borrowers: unknown;
  consolidatedCredits: IConsolidatedCredit[];
  creditProducts: ICreditProduct[];
  outlays: IOutlay[];
}

interface IIncome {
  dividends: number;
  financialIncome: number;
  leases: number;
  otherNonSalaryEmoluments: number;
  pensionAllowances: number;
  periodicSalary: number;
  personalBusinessUtilities: number;
  professionalFees: number;
}

export interface IRefactorIncome {
  borrowerIdentificationNumber: string;
  income: IIncome;
  justification: string;
  prospectCode: string;
}

export interface IRemoveProspect {
  removeProspectsRequest: [
    {
      prospectId: string;
    },
  ];
}

export interface IRemoveProspectResponse {
  prospectId: string;
}

export interface IGuaranteesRequiredByCreditProspect {
  warranty: { warranty: string }[] | string;
}
