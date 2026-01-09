import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IStaffPortalByBusinessManager } from "../types";
import { mapResendApiToEntities } from "./mappers";

const getStaffPortalsByBusinessManager = async (
  staffPortalId?: string,
  businessManagerCode?: string,
  staffPortalCatalogCode?: string,
): Promise<IStaffPortalByBusinessManager[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  let params: Record<string, string> = {};

  if (businessManagerCode && staffPortalCatalogCode) {
    params = {
      businessManagerCode,
      staffPortalCatalogCode,
    };
  } else if (staffPortalId) {
    params = {
      staffPortalId,
      staffPortalCatalogCode: environment.VITE_STAFF_PORTAL_CATALOG_CODE,
    };
  }

  const queryParams = new URLSearchParams(params);

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
        `${environment.IVITE_ISAAS_QUERY_PROCESS_SERVICE}/staff-portals-by-business-manager?${queryParams.toString()}`,
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

      return Array.isArray(data) ? mapResendApiToEntities(data) : [];
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
