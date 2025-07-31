import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IValidateRequirement } from "../types";

export const patchValidateRequirements = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validataRequirements: any | null,
): Promise<IValidateRequirement[] | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "ValidateRequirements",
          "X-Business-Unit": "fondecom",
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(validataRequirements),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/requirements`,
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

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo registrar la novedad en la solicitud de crédito.",
        );
      }
    }
  }
};
