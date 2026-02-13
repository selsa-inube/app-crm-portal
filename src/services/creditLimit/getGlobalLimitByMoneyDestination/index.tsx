import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import {
  IMaximumCreditLimitByMoneyDestination,
  IIncomeSources,
} from "../types";

export const getGlobalLimitByMoneyDestination = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  moneyDestination: string,
  clientIdentificationNumber: string,
  authorizationToken: string,
  incomeSources: IIncomeSources,
): Promise<IMaximumCreditLimitByMoneyDestination[] | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams();

      if (incomeSources.PeriodicSalary) {
        queryParams.set(
          "periodicSalary",
          incomeSources.PeriodicSalary.toString(),
        );
      }
      if (incomeSources.OtherNonSalaryEmoluments) {
        queryParams.set(
          "otherNonSalaryEmoluments",
          incomeSources.OtherNonSalaryEmoluments.toString(),
        );
      }
      if (incomeSources.PensionAllowances) {
        queryParams.set(
          "pensionAllowances",
          incomeSources.PensionAllowances.toString(),
        );
      }
      if (incomeSources.ProfessionalFees) {
        queryParams.set(
          "professionalFees",
          incomeSources.ProfessionalFees.toString(),
        );
      }
      if (incomeSources.Leases) {
        queryParams.set("leases", incomeSources.Leases.toString());
      }
      if (incomeSources.Dividends) {
        queryParams.set("dividends", incomeSources.Dividends.toString());
      }
      if (incomeSources.FinancialIncome) {
        queryParams.set(
          "financialIncome",
          incomeSources.FinancialIncome.toString(),
        );
      }
      if (incomeSources.PersonalBusinessUtilities) {
        queryParams.set(
          "personalBusinessUtilities",
          incomeSources.PersonalBusinessUtilities.toString(),
        );
      }
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetGlobalCreditLimitByMoneyDestination",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-limits/by-money-destination/${moneyDestination}/${clientIdentificationNumber}?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return null;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener los cupos.",
        );
      }
    }
  }

  return null;
};
