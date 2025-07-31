import { environment, maxRetriesServices } from "@config/environment";

import { IValidateRequirement, IUnmetRequirementsAmount } from "./types";

const getUnmetRequirementsAmount = async (
  validDataRequirements: IUnmetRequirementsAmount | null,
  businessUnitPublicCode: string,
): Promise<IValidateRequirement | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = 50000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "GetUnmetRequirementsAmount",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(validDataRequirements),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/requirements`,
        options,
      );
      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ocurrió un error durante la evaluación de requisitos.",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo consultar la cantidad de requsitios no complidos. Error: " +
            error,
        );
      }
    }
  }
};

export { getUnmetRequirementsAmount };
