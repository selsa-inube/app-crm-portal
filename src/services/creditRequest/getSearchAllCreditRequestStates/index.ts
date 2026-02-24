import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ISearchAllCreditRequestStates } from "../types";

export const getSearchAllCreditRequestStates = async (
  businessUnitPublicCode: string,
  token: string,
): Promise<ISearchAllCreditRequestStates> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCreditRequestStates",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          Authorization: token,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-request-states`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay estados de solicitud de crédito.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los estados de solicitud de crédito",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener los estados de solicitud de crédito",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener los estados de solicitud de créditode despues de varios intentos.",
  );
};
