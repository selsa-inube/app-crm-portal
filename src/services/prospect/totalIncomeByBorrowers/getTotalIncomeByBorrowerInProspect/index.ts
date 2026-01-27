import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IIncomeSourceBorrowers } from "./types";

export const getTotalIncomeByBorrowerInProspect = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  borrowerCode: string,
  authorizationToken: string,
): Promise<IIncomeSourceBorrowers[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetTotalIncomeByBorrowerInProspect",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };
      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PROCESS_SERVICE}/prospects/total-income-by-borrowers/${borrowerCode}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los ingresos de los deudores.",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo traer los ingresos de los deudores.",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener los ingresos después de varios intentos.",
  );
};
