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

export interface IScoreData {
  totalScore: number;
  seniority: number;
  centralRisk: number;
  employmentStability: number;
  maritalStatus: number;
  economicActivity: number;
  monthlyIncome: number;
  maxIndebtedness: number;
  incomeScore: number;
  maxLimit: number;
  totalPortafolio: number;
}

export interface IPaymentCapacityData {
  incomeSources: number;
  subsistenceReserve: number;
  newPromises: number;
  lineOfCredit: number;
  maxValue: number;
  extraordinary: number;
  extraordinaryQuotes?: CurrentDataRow[];
}

export interface IdataMaximumCreditLimitService {
  lineOfCreditAbbreviatedName?: string;
  identificationDocumentType: string;
  identificationDocumentNumber: string;
  moneyDestination: string;
  primaryIncomeType: string;
}
