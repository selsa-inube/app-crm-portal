import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ICreditRequest } from "@services/types";

export const getClientPortfolioObligationsById = async (
  businessUnitPublicCode: string,
  ClientIdentificationNumber: string,
): Promise<ICreditRequest[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "ClientPortfolioObligationsById",
          "X-Business-Unit": "fondecom",
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };
      console.log(businessUnitPublicCode);
      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests/client-portfolio-obligations/${ClientIdentificationNumber}`,
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

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener el porfolio de obligaciones del cliente.",
        );
      }
    }
  }

  return [];
};
