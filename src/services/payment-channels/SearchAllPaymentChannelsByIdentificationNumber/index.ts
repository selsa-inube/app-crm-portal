import {
  //environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import {
  IPaymentDatesChannel,
  IResponsePaymentDatesChannel,
} from "../SearchAllPaymentChannelsByIdentificationNumber/types";

export const GetSearchAllPaymentChannels = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  paymentChannel: IPaymentDatesChannel,
): Promise<IResponsePaymentDatesChannel[] | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "SearchAllPaymentChannelsByIdentificationNumber",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        body: JSON.stringify(paymentChannel),
        signal: controller.signal,
      };

      const res = await fetch(
        `http://localhost:8076/icorebanking-vi-crediboard-persistence-process-service/api/payment-channels`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al actualizar documentos requeridos  ",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo actualizar documentos requeridos.",
        );
      }
    }
  }
};
