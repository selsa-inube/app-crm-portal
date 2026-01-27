import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IProspect } from "../types";

const getSearchProspectById = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  prospectCode: string,
  authorizationToken: string,
): Promise<IProspect> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchByIdProspect",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/prospects/${prospectCode}`,
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
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener la información del prospecto.",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener el prospecto después de varios intentos.",
  );
};

export { getSearchProspectById };
