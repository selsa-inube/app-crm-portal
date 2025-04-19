import { environment, fetchTimeoutServices, maxRetriesServices } from "@config/environment";

import { Employee } from "@ptypes/employeePortalConsultation.types";

import { mapEmployeeApiToEntity } from "./mappers";

const getAllEmployees = async (page = 1, perPage = 50): Promise<Employee[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        sort: "FirstName:asc",
      });

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCustomerCatalog",
          "X-Business-Unit": "fondecom",
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICLIENT_QUERY_PROCESS_SERVICE}/customers?${params.toString()}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener la lista de empleados",
          status: res.status,
          data,
        };
      }

      const employees: Employee[] = data.map(mapEmployeeApiToEntity);

      return employees.sort((a: Employee, b: Employee) => a.names.localeCompare(b.names));
    } catch {
      if (attempt === maxRetries) {
        throw new Error(`Todos los intentos fallaron. No se pudo obtener la lista de empleados.`);
      }
    }
  }

  return [];
};

export { getAllEmployees };
