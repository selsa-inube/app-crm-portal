import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IProspect } from "../types";
const getSearchProspectByCode = async (
  businessUnitPublicCode: string,
  prospectCode: string,
): Promise<IProspect> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        prospectCode: prospectCode,
      });
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllProspects",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };
      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PROCESS_SERVICE}/prospects?${queryParams.toString()}`,
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

      if (Array.isArray(data)) {
        return data[0] as IProspect;
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener la tarea.",
        );
      }
    }
  }
  throw new Error("No se pudo obtener la tarea después de varios intentos.");
};
export { getSearchProspectByCode };
