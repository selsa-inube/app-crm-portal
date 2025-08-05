import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { ILinesOfCreditByMoneyDestination } from "../types";

const getLinesOfCreditByMoneyDestination = async (
  businessUnitPublicCode: string,
  moneyDestinationAbbreviatedName: string,
): Promise<ILinesOfCreditByMoneyDestination> => {
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
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/lines-of-credit/by-money-destination/${moneyDestinationAbbreviatedName}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error(
          `No hay líneas de crédito disponibles para el destino de dinero ${moneyDestinationAbbreviatedName}.`,
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: `Error al obtener las líneas de crédito para el destino de dinero ${moneyDestinationAbbreviatedName}.`,
          status: res.status,
          data,
        };
      }

      return data as ILinesOfCreditByMoneyDestination;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          `Todos los intentos fallaron. No se pudo obtener las líneas de crédito para el destino de dinero ${moneyDestinationAbbreviatedName}.`,
        );
      }
    }
  }

  throw new Error(
    `No se pudo obtener las líneas de crédito para el destino de dinero ${moneyDestinationAbbreviatedName}, después de varios intentos.`,
  );
};

export { getLinesOfCreditByMoneyDestination };
