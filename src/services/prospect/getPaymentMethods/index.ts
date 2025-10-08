import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IPaymentMethodsResponse } from "./types";

export const getPaymentMethods = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  lineOfCredit?: string,
): Promise<IPaymentMethodsResponse | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchPortfolioObligationsById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };
      console.log(businessUnitPublicCode);
      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-limits/portfolio-obligations/`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return null;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }
      // i keep this for the future i'ts only testing with the real services and vaoid break the logic
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            paymentMethods: [
              { id: "1", value: "transfer", label: "Transferencia" },
              { id: "2", value: "debit", label: "Débito automático" },
              { id: "3", value: "cash", label: "Efectivo" },
            ],
            paymentCycles: [
              { id: "1", value: "monthly", label: "Mensual" },
              { id: "2", value: "biweekly", label: "Quincenal" },
              { id: "3", value: "weekly", label: "Semanal" },
            ],
            firstPaymentCycles: [
              { id: "1", value: "immediate", label: "Inmediato" },
              { id: "2", value: "30days", label: "30 días" },
              { id: "3", value: "60days", label: "60 días" },
            ],
          });
        }, 500);
      });
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

  return null;
};
