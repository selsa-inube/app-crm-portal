import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IFinancialObligationsUpdateResponse } from "../types";

export const getFinancialObligationsUpdate = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  lineOfCreditAbbreviatedName: string,
  clientIdentificationNumber: string,
  moneyDestination: string,
  authorizationToken: string,
): Promise<IFinancialObligationsUpdateResponse | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "FinancialObligationsUpdateRequired",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/lines-of-credit/financial-obligation-update/${lineOfCreditAbbreviatedName}/${clientIdentificationNumber}/${moneyDestination}`,
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
          "Todos los intentos fallaron. No se pudo obtener la linea obligaciones financieras.",
        );
      }
    }
  }

  return null;
};
