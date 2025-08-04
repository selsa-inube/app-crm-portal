interface ICondition {
  condition: string;
  value: string | number | boolean;
}

export interface IBusinessUnitRules {
  ruleName: string;
  conditions: ICondition[];
}
