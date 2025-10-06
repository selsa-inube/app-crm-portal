import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IMoneyDestination } from "../types";
import { mapMoneyDestinationToEntity } from "./mappers";

const getMoneyDestinations = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
): Promise<IMoneyDestination[]> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_QUERY}/money-destinations`;
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllMoneyDestination",
          "Content-type": "application/json; charset=UTF-8",
          "X-Business-Unit": businessUnitPublicCode,
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(requestUrl, options);
      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();
      if (!res.ok) {
        throw {
          message: "Error al obtener los datos",
          status: res.status,
          data,
        };
      }

      return data.map((item: Record<string, string | number | object>) =>
        mapMoneyDestinationToEntity(item),
      );
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los destinos de dinero.",
        );
      }
    }
  }

  return [];
};

export { getMoneyDestinations };
