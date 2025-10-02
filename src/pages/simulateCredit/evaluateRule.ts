import { IBusinessUnitRules } from "@services/businessUnitRules/types";
import { Rule, RuleValue } from "./types";

export function removeDuplicates<
  T,
  K extends keyof T,
  V extends string | number | boolean,
>(arr: T[], key: K): T[] {
  const seen = new Set<V>();
  return arr.filter((item) => {
    const val = item[key] as V;
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export async function evaluateRule(
  rule: Rule,
  endpoint: (
    business: string,
    manager: string,
    data: Rule,
  ) => Promise<IBusinessUnitRules>,
  uniqueKey: string,
  business: string,
  manager: string,
  allData?: boolean,
): Promise<RuleValue[]> {
  const response = await endpoint(business, manager, rule);

  if (!response || !Array.isArray(response) || response.length === 0) {
    return [];
  }

  const unique = removeDuplicates(response, uniqueKey);
  return allData ? response : unique.map((item) => item[uniqueKey]);
}
