import { fetchTimeoutServices, maxRetriesServices, environment } from "@config/environment";

export interface IRemunerationProfile {
  remunerationProfileId: string;
  remunerationProfileName: string;
  remunerationProfileDescription: string;
  regulatoryFrameworkCode: string;
}

const getRemunerationProfiles = async (): Promise<IRemunerationProfile[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const res = await fetch(
        `${environment.IVITE_IPORTAL_EMPLOYEE_QUERY_PROCESS_SERVICE}/remuneration-profiles-catalog`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Error al obtener los perfiles de remuneración (Status: ${res.status})`);
      }

      const data = await res.json();

      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (attempt === maxRetries) {
        console.error("Error al obtener los perfiles de remuneración:", error);
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener los perfiles de remuneración.",
        );
      }
    }
  }

  return [];
};

export { getRemunerationProfiles };
