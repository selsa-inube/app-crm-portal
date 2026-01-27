import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

export const getSearchDocumentById = async (
  documentId: string,
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
          "X-Action": "SearchDocumentById",
          "X-Business-Unit": businessUnitPublicCode,
          "X-User-Name": userAccount,
          "Content-Type": "application/pdf",
          "X-Process-Manager": businessManagerCode,
          Authorization: `${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/documents/id/${documentId}?mode=file`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay documento disponible.");
      }

      const blob = await res.blob();

      if (!res.ok) {
        throw {
          message: "Error al obtener el documento",
          status: res.status,
          blob,
        };
      }

      return blob;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener el documento.",
        );
      }
    }
  }

  throw new Error(
    "No se logró obtener el documento después de varios intentos.",
  );
};
