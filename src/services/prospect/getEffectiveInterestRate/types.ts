export interface IEffectiveInterestRateResponse {
  periodicInterestRateMin: number;  
  periodicInterestRateMax: number;  
  variabilityFactor: string;
  chargeMonthlyRateForAdditionalLoanCosts: number;
  creditRiskPremium: number;
}
