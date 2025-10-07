import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { mapPaymentCapacityResponse } from "./mapper";
import { IPaymentCapacity, IPaymentCapacityResponse } from "../types";

const getBorrowerPaymentCapacityById = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  data: IPaymentCapacity,
): Promise<IPaymentCapacityResponse | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "GetBorrowerPaymentCapacityByIdentificationNumber",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        body: JSON.stringify(data),
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-limits`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      let responseData: IPaymentCapacityResponse;
      try {
        responseData = await res.json();
      } catch (error) {
        throw new Error("Failed to parse response JSON");
      }

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }

      const normalized = mapPaymentCapacityResponse(responseData);

      return normalized;
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

export { getBorrowerPaymentCapacityById };
