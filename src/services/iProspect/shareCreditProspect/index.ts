import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IShareCreditProspect, IShareCreditProspectResponse } from "./types";

export const patchshareCreditProspect = async (
  businessUnitPublicCode: string,
  payload: IShareCreditProspect,
): Promise<IShareCreditProspectResponse | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const formData = new FormData();
      formData.append("clientName", payload.clientName);
      formData.append("email", payload.email);
      formData.append("optionalEmail", payload.optionalEmail);
      formData.append("prospectId", payload.prospectId);
      if (payload.file) {
        formData.append("file", payload.file);
      }

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "ShareCreditProspect",
          "X-Business-Unit": businessUnitPublicCode,
        },
        body: formData,
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PERSISTENCE_SERVICE}/prospects`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al traer al compartir el archivo..",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo compartir el archivo.",
        );
      }
    }
  }
};
