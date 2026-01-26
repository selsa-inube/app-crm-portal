import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IExtraordinaryAgreement } from "../../types";

export const searchExtraInstallmentPaymentCyclesByCustomerCode = async (
  businessUnitPublicCode: string,
  ClientIdentificationNumber: string,
  lineOfCreditAbbreviatedName: string,
  moneyDestinationAbbreviatedName: string,
): Promise<IExtraordinaryAgreement[] | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchExtraInstallmentPaymentCyclesByCustomerCode",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-limits/${ClientIdentificationNumber}/${lineOfCreditAbbreviatedName}/${moneyDestinationAbbreviatedName}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return null;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message:
            "Ha ocurrido un error al consultar los ciclos de pago extra: ",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener los ciclos de pago extra.",
        );
      }
    }
  }

  return null;
};
