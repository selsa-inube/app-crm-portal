import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IAccountingVouchers } from "../types";
import { mapAccountingVouchersEntities } from "./mappers";

export const getAccountingVouchers = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequestId: string,
): Promise<IAccountingVouchers[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllObligationsById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/obligations/${creditRequestId}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los ",
          status: res.status,
          data,
        };
      }

      const normalizedCredit = Array.isArray(data)
        ? mapAccountingVouchersEntities(data)
        : [];

      return normalizedCredit;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los procesos de consulta.",
        );
      }
    }
  }

  return [];
};
