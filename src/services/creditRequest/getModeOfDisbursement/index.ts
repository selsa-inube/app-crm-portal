import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IModeOfDisbursement } from "../types";
import { mapCreditRequestToEntities } from "./mapper";

export const getModeOfDisbursement = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequestId: string,
  authorizationToken: string,
): Promise<IModeOfDisbursement[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllModeOfDisbursementById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/modes-of-disbursement/${creditRequestId}?`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los modos de desembolso",
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
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los modos de desembolso.",
        );
      }
    }
  }

  return [];
};
