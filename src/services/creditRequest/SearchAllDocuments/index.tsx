import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

export const getSearchAllDocumentsById = async (
  creditRequestId: string,
  userAccount: string,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  authorizationToken: string,
) => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllDocumentsById",
          "X-Business-Unit": businessUnitPublicCode,
          "X-User-Name": userAccount,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/documents/${creditRequestId}`,
        options,
      );
      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay documentos disponibles.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los documentos",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener los documentos.",
        );
      }
    }
  }

  throw new Error(
    "No se lograron obtener los documentos después de varios intentos.",
  );
};
