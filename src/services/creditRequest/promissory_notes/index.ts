import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IPromissoryNotes } from "../types";

export const getPromissoryNotesById = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequestId: string,
  authorizationToken: string,
): Promise<IPromissoryNotes[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllPromissoryNotesById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/promissory-notes/${creditRequestId}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay promesa de financiamiento disponible.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener las promesas de financiación.",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener las promesas de financiación.",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener las promesas de financiación después de varios intentos.",
  );
};
