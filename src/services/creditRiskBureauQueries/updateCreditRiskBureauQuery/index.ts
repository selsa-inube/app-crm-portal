import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IUpdateCreditRiskBureauQuery } from "../types";

export const updateCreditRiskBureauQuery = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  payload: IUpdateCreditRiskBureauQuery,
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
          "X-Action": "UpdateCreditRiskBureauQuery",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-risk-bureau-queries/`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al modificar los scores de crédito.",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo modificar los scores de crédito.",
        );
      }
    }
  }
};
