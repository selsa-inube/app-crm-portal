import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { ILinesOfCreditByMoneyDestinationResponse } from "../types";

export const getExtraInstallmentsAllowed = async (
  businessUnitPublicCode: string,
  lineOfCreditAbbreviatedName: string,
  clientIdentificationNumber: string,
): Promise<ILinesOfCreditByMoneyDestinationResponse | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetExtraInstallmentsAllowed",
          "X-Business-Unit": "test",
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };
      console.log(businessUnitPublicCode);
      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/lines-of-credit/extra-installments-allowed/${lineOfCreditAbbreviatedName}/${clientIdentificationNumber}`,
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
          "Todos los intentos fallaron. No se pudo obtener la linea de abonos extra.",
        );
      }
    }
  }

  return null;
};
