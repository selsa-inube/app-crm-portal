import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ICommercialManagerAndAnalyst } from "../types";
import { mapCommercialManagerAndAnalystEntities } from "./mappers";

export const getCommercialManagerAndAnalyst = async (
  roles: string,
  businessUnitCode: string,
  publicCodeBusinessManager: string,
): Promise<ICommercialManagerAndAnalyst[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        roles: roles,
        businessUnitCode,
        publicCodeBusinessManager,
      });
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchStaffByRoles",
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE}/staffs/?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los ",
          status: res.status,
          data,
        };
      }

      const normalizedCredit = Array.isArray(data)
        ? mapCommercialManagerAndAnalystEntities(data)
        : [];

      return normalizedCredit;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los procesos de consulta.",
        );
      }
    }
  }

  return [];
};
