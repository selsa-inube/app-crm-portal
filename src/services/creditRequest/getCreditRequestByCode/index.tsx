import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { CreditRequestParams, ICreditRequest } from "../types";
import { mapCreditRequestToEntities } from "./mapper";

export const getCreditRequestByCode = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  userAccount: string,
  params: CreditRequestParams,
): Promise<ICreditRequest[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  // console.log(businessUnitPublicCode, businessManagerCode, userAccount, params, "pepe")

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams();

      if (params.creditRequestCode) {
        queryParams.set("creditRequestCode", params.creditRequestCode);
      }

      if (params.clientIdentificationNumber) {
        queryParams.set(
          "clientIdentificationNumber",
          params.clientIdentificationNumber,
        );
      }

      if (params.textInSearch) {
        queryParams.set("textInSearch", params.textInSearch);
      }

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCreditRequestsInProgress",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "x-user-name": userAccount,
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }

      const normalizedCredit = Array.isArray(data)
        ? mapCreditRequestToEntities(data)
        : [];

      return normalizedCredit;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los procesos de consulta.",
        );
      }
    }
  }

  return [];
};
