import { IBorrowerProperty, IIncomeSources } from "@services/creditLimit/types";

import { IObligations } from "../../TableObligationsFinancial/types";

export const transformFinancialObligations = (
  borrowerProperties: IBorrowerProperty[],
) => {
  const obligationProperties = borrowerProperties.filter(
    (prop) => prop.propertyName === "FinancialObligation",
  );

  const transformedObligations = obligationProperties.map((prop) => {
    const parts = prop.propertyValue.split(",").map((part) => part.trim());

    const [
      productName,
      balanceObligationTotalStr,
      nextPaymentValueTotal,
      entity,
      paymentMethodName,
      obligationNumber,
      duesPaidStr,
      outstandingDuesStr,
    ] = parts;

    return {
      productName: productName,
      balanceObligationTotal: parseFloat(balanceObligationTotalStr) || 0,
      nextPaymentValueTotal: nextPaymentValueTotal,
      entity: entity,
      paymentMethodName: paymentMethodName,
      obligationNumber: obligationNumber,
      duesPaid: parseInt(duesPaidStr, 10) || 0,
      outstandingDues: parseInt(outstandingDuesStr, 10) || 0,
    };
  });

  return transformedObligations;
};

export const unformatCurrency = (value: number | string): string => {
  if (value === undefined || value === null) return "0";
  return String(value).replace(/\D/g, "");
};

export const updateBorrowerPropertiesWithNewObligations = (
  newObligations: IObligations[],
  originalBorrowerProperties: IBorrowerProperty[],
) => {
  const otherProperties = originalBorrowerProperties.filter(
    (prop) => prop.propertyName !== "FinancialObligation",
  );

  const newFinancialObligationProperties = newObligations.map(
    (obligation: IObligations) => {
      const propertyValue = [
        obligation.productName,
        unformatCurrency(obligation.balanceObligationTotal),
        unformatCurrency(obligation.nextPaymentValueTotal),
        obligation.entity,
        obligation.paymentMethodName,
        obligation.obligationNumber,
        obligation.duesPaid,
        obligation.outstandingDues,
      ].join(",");

      return {
        propertyName: "FinancialObligation",
        propertyValue: propertyValue,
      };
    },
  );

  return [...newFinancialObligationProperties, ...otherProperties];
};

export const updateBorrowerPropertiesWithNewIncome = (
  newIncome: IIncomeSources,
  originalBorrowerProperties: IBorrowerProperty[],
): IBorrowerProperty[] => {
  const incomePropertyNames = [
    "Dividends",
    "FinancialIncome",
    "Leases",
    "OtherNonSalaryEmoluments",
    "PensionAllowances",
    "PeriodicSalary",
    "PersonalBusinessUtilities",
    "ProfessionalFees",
  ];

  const otherProperties = originalBorrowerProperties.filter(
    (prop) => !incomePropertyNames.includes(prop.propertyName),
  );

  const newIncomeProperties: IBorrowerProperty[] = Object.entries(newIncome)
    .filter(([key]) => incomePropertyNames.includes(key))
    .map(([key, value]) => ({
      propertyName: key,
      propertyValue: String(value),
    }));

  return [...otherProperties, ...newIncomeProperties];
};
