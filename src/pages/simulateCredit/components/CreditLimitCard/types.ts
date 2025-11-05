import { CurrentDataRow } from "@components/modals/PaymentCapacityModal/types";

export interface ICreditLimitData {
  maxPaymentCapacity: number;
  maxReciprocity: number;
  maxDebtFRC: number;
  assignedLimit: number;
  maxUsableLimit: number;
  availableLimitWithoutGuarantee: number;
}

export interface IMaxLimitData {
  reportedIncomeSources: number;
  reportedFinancialObligations: number;
  subsistenceReserve: number;
  availableForNewCommitments: number;
  maxVacationTerm: number;
  maxAmount: number;
}

export interface IPaymentCapacityData {
  extraordinaryQuotes?: CurrentDataRow[];
}

export interface IdataMaximumCreditLimitService {
  lineOfCreditAbbreviatedName?: string;
  identificationDocumentType: string;
  identificationDocumentNumber: string;
  moneyDestination: string;
  primaryIncomeType: string;
}
