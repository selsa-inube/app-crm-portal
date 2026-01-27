import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IPackagesOfRequirementsById } from "../types";

const getAllPackagesOfRequirementsById = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  uniqueReferenceNumber: string,
  authorizationToken: string,
): Promise<IPackagesOfRequirementsById[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        uniqueReferenceNumber: uniqueReferenceNumber,
      });

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllPackagesOfRequirements",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/requirements-packages?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay requisitos disponibles.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los requisitos.",
          status: res.status,
          data,
        };
      }

      if (Array.isArray(data)) {
        return data;
      }

      throw new Error("La respuesta no contiene un array de requisitos.");
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener los requisitos.",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener los requisitos después de varios intentos.",
  );
};

export { getAllPackagesOfRequirementsById };
