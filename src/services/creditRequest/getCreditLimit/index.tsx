import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IIncomeSources } from "@src/services/creditLimit/getIncomeSources/types";

import { mapCreditLimitEntity } from "./mapper";

const getCreditLimit = async (
  businessUnitPublicCode: string,
  clientIdentificationNumber: string,
): Promise<IIncomeSources> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchClientIncomeSourcesById",
          "X-Business-Unit": "fondecom",
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      console.log(businessUnitPublicCode);
      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-limits/client-income-sources/${clientIdentificationNumber}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay credito disponible.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener credito.",
          status: res.status,
          data,
        };
      }

      return mapCreditLimitEntity(data);
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo traer el credito.",
        );
      }
    }
  }

  throw new Error("No se pudo obtener el credito después de varios intentos.");
};

export { getCreditLimit };
