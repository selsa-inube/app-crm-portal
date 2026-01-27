import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ISearchAllModesOfDisbursementTypes } from "../types";

const getSearchAllModesOfDisbursementTypes = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  clientIdentificationNumber: string,
  lineOfCreditAbbreviatedName: string,
  moneyDestinationAbbreviatedName: string,
  loanAmount: string,
  authorizationToken: string,
): Promise<ISearchAllModesOfDisbursementTypes | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const queryParams = new URLSearchParams({
        clientIdentificationNumber: clientIdentificationNumber || "",
        lineOfCreditAbbreviatedName: lineOfCreditAbbreviatedName || "",
        moneyDestinationAbbreviatedName: moneyDestinationAbbreviatedName || "",
        loanAmount,
      });
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllModesOfDisbursementTypes",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/lines-of-credit/?${queryParams.toString()}`,
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

      return data as ISearchAllModesOfDisbursementTypes;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          `Todos los intentos fallaron. No se pudo obtener los tipos de desembolso `,
        );
      }
    }
  }

  return null;
};

export { getSearchAllModesOfDisbursementTypes };
