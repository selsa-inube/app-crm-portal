export interface ICreditLimitData {
  maxPaymentCapacity: number;
  maxReciprocity: number;
  maxDebtFRC: number;
  assignedLimit: number;
  currentPortfolio: number;
  maxUsableLimit: number;
  availableLimitWithoutGuarantee: number;
}

export interface IPaymentCapacityData {
  reportedIncomeSources: number;
  reportedFinancialObligations: number;
  subsistenceReserve: number;
  availableForNewCommitments: number;
  maxVacationTerm: number;
  maxAmount: number;
}

export interface IReciprocityData {
  balanceOfContributions: number;
  accordingToRegulation: number;
  assignedQuota: number;
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
}
