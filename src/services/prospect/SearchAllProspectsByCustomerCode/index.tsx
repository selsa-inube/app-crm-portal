import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IProspect } from "../types";
import { ErrorSearchAllProspectsByCustomerCode } from "./ErrorSearchAllProspectsByCustomerCode";

const getProspectsByCustomerCode = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  customerCode: string,
  state?: string,
  authorizationToken?: string,
): Promise<IProspect[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const queryParams = new URLSearchParams({
        state: state || "",
      });
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllProspectsByCustomerCode",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `${authorizationToken}`,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PROCESS_SERVICE}/prospects/prospect-by-customer/${customerCode}?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw Error(
          ErrorSearchAllProspectsByCustomerCode.NoHaveProspectsAvailable,
        );
      }

      const data = await res.json();
      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [data];
    } catch (error) {
      if (
        String(error).includes(
          ErrorSearchAllProspectsByCustomerCode.NoHaveProspectsAvailable,
        )
      ) {
        throw new Error(
          ErrorSearchAllProspectsByCustomerCode.NoHaveProspectsAvailable,
        );
      } else if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener el prospecto.",
        );
      }
    }
  }

  throw new Error("No se pudo obtener la tarea después de varios intentos.");
};

export { getProspectsByCustomerCode };
