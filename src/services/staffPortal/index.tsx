import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IStaffPortalByBusinessManager } from "./types";
import { mapResendApiToEntities } from "./mappers";

const getStaffPortalsByBusinessManager = async (): Promise<
  IStaffPortalByBusinessManager[]
> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllStaffPortalsByBusinessManager",
          "Content-type": "application/json; charset=UTF-8",
        },
      };

      const res = await fetch(
        `${environment.IVITE_ISAAS_QUERY_PROCESS_SERVICE}/staff-portals-by-business-manager`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(`Error al obtener los datos: ${res.status}`);
      }

      const normalizedUser = Array.isArray(data)
        ? mapResendApiToEntities(data)
        : [];

      return normalizedUser;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los datos del operador.",
        );
      }
    }
  }

  return [];
};

export { getStaffPortalsByBusinessManager };
