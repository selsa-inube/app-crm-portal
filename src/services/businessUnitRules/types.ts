interface ICondition {
  condition: string;
  value: string | number;
}

export interface IBusinessUnitRules {
  ruleName: string;
  conditions: ICondition[];
}
