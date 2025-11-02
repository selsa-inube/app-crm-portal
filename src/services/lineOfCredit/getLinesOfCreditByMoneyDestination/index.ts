import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { ILinesOfCreditByMoneyDestination } from "../types";

const getLinesOfCreditByMoneyDestination = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  moneyDestinationAbbreviatedName: string,
  clientIdentificationNumber: string,
): Promise<ILinesOfCreditByMoneyDestination | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetLinesOfCreditByMoneyDestination",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/lines-of-credit/${moneyDestinationAbbreviatedName}/${clientIdentificationNumber}`,
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

      return [
        {
          abbreviateName: "LIBRE_INVERSION",
          amortizationType: ["CUOTA_FIJA", "ABONO_CAPITAL"],
          description: "Crédito de libre inversión para cualquier propósito",
          maxAmount: 50000000,
          maxEffectiveInterestRate: 2.5,
          maxTerm: 60,
          minAmount: 1000000,
          minEffectiveInterestRate: 1.2,
          minTerm: 6,
        },
        {
          abbreviateName: "VEHICULO",
          amortizationType: ["CUOTA_FIJA"],
          description: "Crédito para compra de vehículo nuevo o usado",
          maxAmount: 80000000,
          maxEffectiveInterestRate: 1.8,
          maxTerm: 72,
          minAmount: 5000000,
          minEffectiveInterestRate: 1.0,
          minTerm: 12,
        },
        {
          abbreviateName: "VIVIENDA",
          amortizationType: [
            "CUOTA_FIJA",
            "ABONO_CAPITAL",
            "CUOTA_DECRECIENTE",
          ],
          description: "Crédito hipotecario para compra de vivienda",
          maxAmount: 200000000,
          maxEffectiveInterestRate: 1.5,
          maxTerm: 240,
          minAmount: 20000000,
          minEffectiveInterestRate: 0.8,
          minTerm: 60,
        },
        {
          abbreviateName: "EDUCACION",
          amortizationType: ["CUOTA_FIJA"],
          description: "Crédito educativo para estudios superiores",
          maxAmount: 30000000,
          maxEffectiveInterestRate: 1.0,
          maxTerm: 48,
          minAmount: 2000000,
          minEffectiveInterestRate: 0.5,
          minTerm: 12,
        },
      ] as ILinesOfCreditByMoneyDestination;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          `Todos los intentos fallaron. No se pudo obtener las líneas de crédito para el destino de dinero ${moneyDestinationAbbreviatedName}.`,
        );
      }
    }
  }

  return null;
};

export { getLinesOfCreditByMoneyDestination };
