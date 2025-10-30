export interface IValidateIncrementRequest {
  lineOfCredit: string;
  moneyDestination: string;
  amortizationType: string;
  incrementType: "value" | "percentage";
  incrementValue: number;
  loanAmount?: number;
}

export interface IValidateIncrementResponse {
  isValid: boolean;
  minValue: number;
  maxValue: number;
  message?: string;
}
