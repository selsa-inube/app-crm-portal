import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IGuarantees } from "@services/prospect/types";

const getGuaranteesById = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequest: string,
  token: string,
): Promise<IGuarantees[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllGuaranteesById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: token,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/guarantees/${creditRequest}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay garantias disponibles.");
      }

      const data = await res.json();
      if (!res.ok) {
        throw {
          message: "Error al obtener las garantias.",
          status: res.status,
          data,
        };
      }

      if (Array.isArray(data) && data.length > 0) {
        return data;
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener las garantias.",
        );
      }
    }
  }

  throw new Error(
    "No se pudo obtener las garantias después de varios intentos.",
  );
};

export { getGuaranteesById };
