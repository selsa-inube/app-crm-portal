import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IProspect } from "../types";

export const recalculateProspect = async (
  businessUnitPublicCode: string,
  prospectCode: string,
): Promise<IProspect | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "RecalculateProspect",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
        body: JSON.stringify({ prospectCode }),
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects/`,
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

      return data.borrowers[0];
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo recalcular el prospecto.",
        );
      }
    }
  }

  return null;
};
