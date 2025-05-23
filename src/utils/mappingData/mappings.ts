import { MaritalStatus, EconomicActivity, Schedule } from "@services/enums";

export const getMaritalStatusInSpanish = (
  status: keyof typeof MaritalStatus,
) => {
  return MaritalStatus[status];
};

export const getEconomicActivityInSpanish = (
  activity: keyof typeof EconomicActivity,
) => {
  return EconomicActivity[activity];
};

export const getScheduleInSpanish = (schedule: Schedule): string => {
  switch (schedule) {
    case Schedule.Weekly:
      return "Semanal";
    case Schedule.TenDayIntervals:
      return "Intervalos de 10 días";
    case Schedule.Biweekly:
      return "Quincenal";
    case Schedule.Semimonthly:
      return "Bimensual";
    case Schedule.Monthly:
      return "Mensual";
    case Schedule.Bimonthly:
      return "Bimestral";
    case Schedule.Quarterly:
      return "Trimestral";
    case Schedule.Semiannually:
      return "Semestral";
    case Schedule.Annually:
      return "Anual";
    default:
      return schedule;
  }
};

export const getPropertyValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any[] | undefined,
  propertyName: string,
): string => {
  if (!Array.isArray(properties)) return "";
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties.find((prop: any) => prop.property_name === propertyName)
      ?.property_value || ""
  );
};

export const removeDuplicates = <T, K extends keyof T>(
  array: T[],
  key: K,
): T[] => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};
