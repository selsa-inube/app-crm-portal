import { environment, fetchTimeoutServices, maxRetriesServices } from "@config/environment";
import { IStaffUserAccount } from "@ptypes/staffPortalBusiness.types";
import { mapStaffUserAccountApiToEntity } from "./mappers";

const staffUserAccountById = async (userAccountEmail: string): Promise<IStaffUserAccount> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const queryParams = new URLSearchParams({
        userAccount: userAccountEmail,
      });

      const requestUrl = `${environment.VITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE}/staff-user-accounts?${queryParams.toString()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "X-Action": "SearchAllStaffUserAccount",
        },
        signal: controller.signal,
      };

      const res = await fetch(requestUrl, options);

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return {} as IStaffUserAccount;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los datos del usuario",
          status: res.status,
          data,
        };
      }

      return mapStaffUserAccountApiToEntity(data);
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los datos del usuario.",
        );
      }
    }
  }

  return {} as IStaffUserAccount;
};

export { staffUserAccountById };
