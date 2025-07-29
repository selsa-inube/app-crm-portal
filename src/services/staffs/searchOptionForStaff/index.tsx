import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { mapStaffOptionToEntity } from "./mappers";
import { IOptionStaff } from "./types";

const getSearchOptionForStaff = async (
  portalPublicCode: string,
  businessUnitPublicCode: string,
  userAccount: string,
): Promise<IOptionStaff[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        portalPublicCode: portalPublicCode,
        businessUnitPublicCode: businessUnitPublicCode,
      });
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchOptionForStaff",
          "Content-type": "application/json; charset=UTF-8",
          "X-User-Name": userAccount,
        },
      };
      const res = await fetch(
        `${environment.IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE}/staffs?${queryParams.toString()}`,
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

      return data.map((item: Record<string, string | number | object>) =>
        mapStaffOptionToEntity(item),
      );
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener las opciones del personal.",
        );
      }
    }
  }
  return [];
};

export { getSearchOptionForStaff };
