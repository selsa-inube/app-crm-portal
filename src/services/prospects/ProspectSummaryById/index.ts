import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IProspectSummaryById } from "./types";

const getSearchProspectSummaryById = async (
  businessUnitPublicCode: string,
  prospectCode: string,
): Promise<IProspectSummaryById> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PROCESS_SERVICE}/prospects/${prospectCode}`,
        {
          method: "GET",
          headers: {
            "X-Action": "GetProspectSummaryById",
            "X-Business-Unit": businessUnitPublicCode,
            "Content-type": "application/json; charset=UTF-8",
          },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay resumen de montos disponibles.");
      }

      const data = await res.json();

      if (!res.ok) {
        const backendMessage =
          typeof data === "object" && data !== null && "message" in data
            ? String(data.message)
            : "Error al obtener el resumen de montos.";
        throw new Error(backendMessage);
      }

      return Array.isArray(data)
        ? (data[0] as IProspectSummaryById)
        : (data as IProspectSummaryById);
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);

      if (attempt === maxRetries) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }

        throw new Error(
          "Todos los intentos fallaron. No se pudo traer el resumen de montos.",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener el resumen de montos después de varios intentos.",
  );
};

export { getSearchProspectSummaryById };
