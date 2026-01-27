import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IApprovals } from "@pages/financialReporting/Approvals/types";

export const getApprovalsById = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequestId: string,
  authorizationToken: string,
): Promise<IApprovals> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllApprovalsById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/approvals/${creditRequestId}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay aprobaciones disponibles.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener las aprobaciones.",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se logro obtener las aprobaciones",
        );
      }
    }
  }

  throw new Error(
    "No se logro obtener las aprobaciones después de varios intentos.",
  );
};
