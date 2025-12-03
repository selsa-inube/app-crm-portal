import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IGuaranteesRequiredByCreditProspect } from "../types";

export const getGuaranteesRequiredByCreditProspect = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  prospectCode: string,
): Promise<IGuaranteesRequiredByCreditProspect | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetGuaranteesRequiredByCreditProspect",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PROCESS_SERVICE}/prospects/${prospectCode}`,
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

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener las garantías de la solicitud de crédito.",
        );
      }
    }
  }

  return null;
};
