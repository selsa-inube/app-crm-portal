import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { ICustomer } from "../types";

const getSearchCustomerByCode = async (
  publicCode: string,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  silent = false,
): Promise<ICustomer | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  const queryParams = new URLSearchParams({
    publicCode: publicCode,
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCustomerCatalog",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICLIENT_QUERY_PROCESS_SERVICE}/customers?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay tarea disponible.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener la tarea.",
          status: res.status,
          data,
        };
      }

      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }

      return data;
    } catch (error) {
      if (!silent) {
        console.error(`Intento ${attempt} fallido:`, error);
        if (attempt === maxRetries) {
          throw new Error(
            "Todos los intentos fallaron. No se pudo obtener la tarea.",
          );
        }
      }
    }
  }

  return null;
};

export { getSearchCustomerByCode };
