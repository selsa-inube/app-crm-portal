import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import {
  IPatchValidateRequirementsPayload,
  IValidateRequirement,
} from "../types";

export const postDocumentsRequiredByCreditRequest = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  validataRequirements: IPatchValidateRequirementsPayload,
  userAccount: string,
  authorizationToken: string,
): Promise<IValidateRequirement[] | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "GetDocumentsRequiredByCreditRequest",
          "X-User-Name": userAccount,
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: `Bearer ${authorizationToken}`,
        },
        body: JSON.stringify(validataRequirements),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`,
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
