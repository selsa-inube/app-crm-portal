interface IEnumConfig {
  path: string;
  xAction: string;
}

export const enumPaths: Record<string, IEnumConfig> = {
  requirementStatus: {
    path: "/enumerators-requirement-status",
    xAction: "GetAllEnumsRequirementStatus",
  },

  moneyDestination: {
    path: "/enumerators-money-destination",
    xAction: "GetAllEnumsMoneyDestination",
  },

  paymentChannel: {
    path: "/enumerators-payment-channel",
    xAction: "GetAllEnumsPaymentChannel",
  },

  rateType: {
    path: "/enumerators-rate-type",
    xAction: "GetAllEnumsRateType",
  },

  paymentSchedule: {
    path: "/enumerators-payment-schedule",
    xAction: "GetAllEnumsPaymentSchedule",
  },

  incomeSource: {
    path: "/enumerators-income-source",
    xAction: "GetAllEnumsIncomeSource",
  },
};
