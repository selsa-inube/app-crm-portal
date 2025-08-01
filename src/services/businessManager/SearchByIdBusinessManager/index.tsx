import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IBusinessManagers } from "../types";
import { mapResendApiToEntity } from "./mappers";

const getBusinessManagers = async (
  businessManagerId: string,
): Promise<IBusinessManagers> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchByIdBusinessManager",
          "Content-type": "application/json; charset=UTF-8",
        },
      };

      const res = await fetch(
        `${environment.IVITE_ISAAS_QUERY_PROCESS_SERVICE}/business-managers/${businessManagerId}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return {} as IBusinessManagers;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          `Error al obtener los datos: ${res.status}, Detalles: ${JSON.stringify(data)}`,
        );
      }

      return mapResendApiToEntity(data);
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los datos del negocio.",
        );
      }
    }
  }

  return {} as IBusinessManagers;
};

export { getBusinessManagers };
