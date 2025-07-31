import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

export const saveDocument = async (
  businessUnitPublicCode: string,
  creditRequestId: string | undefined,
  abbreviatedName: string | undefined,
  file: File | undefined,
) => {
  if (!file) throw new Error("No se ha seleccionado un archivo.");

  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const formData = new FormData();
      formData.append("creditRequestId", creditRequestId || "");
      formData.append("abbreviatedName", abbreviatedName || "");
      formData.append("file", file);
      formData.append("transactionOperation", "Insert");

      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "SaveDocument",
          "X-Business-Unit": businessUnitPublicCode,
        },
        body: formData,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return res;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al cargar el documento. Por favor, intente de nuevo.",
          status: res.status,
          data,
        };
      }
      return { ...data, statusServices: res.status };
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se logro cargar los documentos.",
        );
      }
    }
  }
  throw new Error("No se pudo completar la solicitud.");
};
