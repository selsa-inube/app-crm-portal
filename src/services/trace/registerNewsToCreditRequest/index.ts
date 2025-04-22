import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ITraceType } from "@services/types";

export const registerNewsToCreditRequest = async (
  businessUnitPublicCode: string,
  userAccount: string,
  payload: ITraceType,
): Promise<void> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "RegisterNewsToACreditRequest",
          "X-Business-Unit": businessUnitPublicCode,
          "X-User-Name": userAccount,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al actualizar la solicitud de crédito",
          status: res.status,
          data,
        };
      }

      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo registrar la novedad en la solicitud de crédito.",
        );
      }
    }
  }
};
