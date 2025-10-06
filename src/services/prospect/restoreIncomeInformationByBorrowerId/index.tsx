import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IRefactorIncome } from "../types";

export const restoreIncomeInformationByBorrowerId = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  payload: IRefactorIncome,
): Promise<IRefactorIncome | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "RestoreIncomeInformationByBorrowerId",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        body: JSON.stringify(payload),
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
          message: "Ha ocurrido un error: ",
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
          "Todos los intentos fallaron. No se pudo restaurar las fuentes de ingresos.",
        );
      }
    }
  }
};
