import { environment, maxRetriesServices } from "@config/environment";

import { IUnmetRequirementsAmount } from "./IUnmetRequirementsAmount";
import { IValidateRequirement } from "./types";

const getUnmetRequirementsAmount = async (
  validataRequirements: IUnmetRequirementsAmount | null,
): Promise<IValidateRequirement | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = 50000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "GetUnmetRequirementsAmount",
          "X-Business-Unit": "test",
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
          message: "Error al acceder a los requisitos no cumplidos.",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo consultar el monto de requisitos no cumplidos. error: " +
            error,
        );
      }
    }
  }
};

export { getUnmetRequirementsAmount };
