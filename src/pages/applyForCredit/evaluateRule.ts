import { Rule } from "./types";

export function removeDuplicates<T>(arr: T[], key: string): T[] {
  const seen = new Set();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return arr.filter((item: any) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export async function evaluateRule(
  rule: Rule,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endpoint: (business: string, data: Rule) => Promise<any>,
  uniqueKey: string,
  business: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const response = await endpoint(business, rule);

  if (!response || !Array.isArray(response) || response.length === 0) {
    return [];
  }

  const unique = removeDuplicates(response, uniqueKey);
  return unique.map((item) => item[uniqueKey]);
}
