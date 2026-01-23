import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IPayment } from "./types";
import { mapCreditPaymentsApiToEntities } from "./mappers";

const getCreditPayments = async (
  userIdentification: string,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  authorizationToken: string,
): Promise<IPayment[] | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        customerCode: userIdentification,
      });

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllPortfolioObligationPayment",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
      };

      const res = await fetch(
        `${
          environment.VITE_ICLIENT_QUERY_PROCESS_SERVICE
        }/portfolio-obligations/payment?${queryParams.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }

      const normalizedCreditPayments = Array.isArray(data)
        ? mapCreditPaymentsApiToEntities(data)
        : [];

      return normalizedCreditPayments;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener el portafolio de obligaciones.",
        );
      }
    }
  }
};

export { getCreditPayments };
