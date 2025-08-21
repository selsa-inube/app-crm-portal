interface ICondition {
  name: string;
  dataType: string;
  value: string;
  valueUse: string;
}

export interface ILinesOfCreditByMoneyDestination {
  name: string;
  dataType: string;
  value: string;
  valueUse: string;
  startDate: string;
  totalConditionsEvaluated: number;
  dataEvaluated: string[];
  typeDecision: string;
  conditions: ICondition[];
}

export interface ILinesOfCreditByMoneyDestinationResponse {
  additionalBorowersAllowed: string;
}
