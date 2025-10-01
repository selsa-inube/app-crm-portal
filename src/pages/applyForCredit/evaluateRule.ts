import { IBusinessUnitRules } from "@services/businessUnitRules/types";
import { Rule } from "./types";

export function removeDuplicates<T, K extends keyof T>(arr: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return arr.filter((item) => {
    const val = item[key];
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
  ) => Promise<IBusinessUnitRules | undefined>,
  uniqueKey: string,
  business: string,
  manager: string,
): Promise<IBusinessUnitRules[]> {
  const response = await endpoint(business, manager, rule);

  if (!response || !Array.isArray(response) || response.length === 0) {
    return [];
  }

  const unique = removeDuplicates(response, uniqueKey);
  return unique.map((item) => item[uniqueKey]);
}
