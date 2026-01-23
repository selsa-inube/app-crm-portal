import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { mapCreditRequestToEntities } from "./mappers";

export const getSearchUseCaseForStaff = async (
  businessUnitCode: string,
  businessManagerCode: string,
  userAccount: string,
  authorizationToken: string,
): Promise<string[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        businessUnitCode: businessUnitCode || "",
        businessManagerCode: businessManagerCode || "",
      });

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchUseCaseForStaff",
          "X-User-Name": userAccount,
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const url = `${environment.IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE}/staffs/?${queryParams.toString()}`;

      const res = await fetch(url, options);
      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }
      const data = await res.json();

      if (!res.ok) {
        throw new Error(`Error al obtener los datos: ${res.status}`);
      }

      return mapCreditRequestToEntities(data);
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
