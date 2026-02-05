import { IDisbursementGeneral } from "@pages/payrollBenefits/types";

import { ICalculatedSeries } from "../creditRequest/types";
import { IValidateRequirement } from "../requirement/types";

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
  paymentChannelAbbreviatedName: string;
  installmentFrequency: string;
  installmentAmount: number;
  numberOfInstallments?: number;
  gradientRate?: number;
  gradientValue?: number;
  gradientFrequency?: string;
  firstGradientDate?: Date;
  installmentAmountForCapital?: number;
  humanChannelPaymentDay?: number;
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
  extraordinaryInstallments: IExtraordinaryInstallment[] | ICalculatedSeries[];
  prospectId: string;
}

export interface IAcquiredCashFlow {
  amount: string;
  date: Date;
  paymentChannelAbbreviatedName: string;
  flowNumber: number;
  humanChannelPaymentDay?: number;
}

export interface ICreditProduct {
  creditProductCode: string;
  loanAmount: number;
  lineOfCreditAbbreviatedName: string;
  installmentFrequency: string;
  loanTerm: number;
  ordinaryInstallmentsForPrincipal: IOrdinaryInstallmentsForPrincipal[];
  interestRateDueType?: string;
  selectedRegularPaymentSchedule?: string;
  interestRate?: number;
  prospectId?: string;
  schedule?: string;
  fixedPoints?: number;
  installmentsForInterest?: IInstallmentsForInterest[];
  extraordinaryInstallments?: IExtraordinaryInstallment[];
  acquiredCashFlows?: IAcquiredCashFlow[];
  referenceIndexForVariableInterestRate?: string;
  installmentAmount?: number;
}

export interface IAddProduct {
  creditProduct: ICreditProduct;
  firstPaymentCycleDate: string | Date;
  paymentCycle: string;
  prospectId: string;
  installmentAmount?: number;
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
  requestedValue?: string;
  disbursementGeneral?: IDisbursementGeneral;
  requirementsValidation?: {
    requirements: IValidateRequirement[];
    isValid: boolean;
    validatedAt: Date | null;
    unfulfilledCount: number;
  };
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
  income?: IIncome;
  justification: string;
  prospectCode: string;
}

export interface ICancelProspect {
  cancelProspectsRequest: [
    {
      prospectId: string;
      prospectCode: string;
      clientIdentificationNumber: string;
    },
  ];
}

export interface ICancelProspectResponse {
  prospectId: string;
}

export interface IGuaranteesRequiredByCreditProspect {
  warranty: { warranty: string }[] | string;
}

export interface simulationPrerequisites {
  canSimulate: string;
  creditPlacementChannel: [string];
}
export interface IValidatePrerequisitesForCreditApplication {
  isCreditSetupCompleteForCreditRequest: "Y" | "N";
}
