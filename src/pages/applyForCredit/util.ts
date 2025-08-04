// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTotalFinancialObligations = (properties: any[]) => {
  return properties
    .filter((prop) => prop.propertyName === "FinancialObligation")
    .reduce((total, prop) => {
      const values = Array.isArray(prop.propertyValue)
        ? prop.propertyValue
        : prop.propertyValue.split(",").map((v: string) => v.trim());

      const amount = Number(values[2] || 0);

      return total + amount;
    }, 0);
};

type Condition = {
  condition: string;
  value: string | number;
};

type Ruleload = {
  ruleName: string;
  conditions: Condition[];
};

export const createRule = (
  ruleName: string,
  conditions: Condition[],
): Ruleload => ({
  ruleName,
  conditions,
});

type RuleTemplate = {
  ruleName: string;
  conditions: { condition: string; valueKey: string }[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextData = Record<string, number | string | boolean>;

export function buildRule(template: RuleTemplate, contextData: ContextData) {
  return {
    ruleName: template.ruleName,
    conditions: template.conditions.map((c) => ({
      condition: c.condition,
      value: contextData[c.valueKey],
    })),
  };
}
