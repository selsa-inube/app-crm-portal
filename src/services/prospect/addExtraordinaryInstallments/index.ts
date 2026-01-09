import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { mapExtraordinaryInstallmentsEntity } from "./mappers";
import { IExtraordinaryInstallments } from "../types";

export const addExtraordinaryInstallments = async (
  extraordinaryInstallments: IExtraordinaryInstallments,
  businessUnitPublicCode: string,
): Promise<IExtraordinaryInstallments | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "AddExtraordinaryInstallments",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(
          mapExtraordinaryInstallmentsEntity(extraordinaryInstallments),
        ),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al crear cuotas extraordinarias",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo guardar los Pagos Extras.",
        );
      }
    }
  }
};
