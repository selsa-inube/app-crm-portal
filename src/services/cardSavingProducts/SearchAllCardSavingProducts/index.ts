import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IAllInternal } from "../types";

const getAllInternalAccounts = async (
  customerCode: string,
  businessUnitPublicCode: string,
): Promise<IAllInternal[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  const queryParams = new URLSearchParams({
    customerCode: customerCode,
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCardSavingProducts",
          "X-Business-Unit": "fondecom",
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICLIENT_QUERY_PROCESS_SERVICE}/card-saving-products/?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay datos disponibles.");
      }

      console.log(businessUnitPublicCode);
      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los datos de las cuentas internas.",
          status: res.status,
          data,
        };
      }

      if (Array.isArray(data)) {
        return data;
      }

      throw new Error("La respuesta no contiene un array de cuentas.");
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No fue posible establecer comunicación con el servidor",
        );
      }
    }
  }

  throw new Error("No fue posible establecer comunicación con el servidor.");
};

export { getAllInternalAccounts };
