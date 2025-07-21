import { environment } from "@config/environment";

import { mapStaffOptionToEntity } from "./mappers";
import { IOptionStaff } from "./types";

const getSearchOptionForStaff = async (
  portalPublicCode: string,
  businessUnitPublicCode: string,
  userAccount: string,
): Promise<IOptionStaff[]> => {
  const queryParams = new URLSearchParams({
    portalPublicCode: portalPublicCode,
    businessUnitPublicCode: businessUnitPublicCode,
  });

  const requestUrl = `${environment.IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE}/staffs?${queryParams.toString()}`;

  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "X-Action": "SearchOptionForStaff",
        "Content-type": "application/json; charset=UTF-8",
        "X-User-Name": userAccount,
      },
    };

    const res = await fetch(requestUrl, options);
    if (res.status === 204) {
      return [];
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Error al obtener los datos: ${res.status}`);
    }

    return data.map((item: Record<string, string | number | object>) =>
      mapStaffOptionToEntity(item),
    );
  } catch (error) {
    console.error(error);
  }

  return [];
};

export { getSearchOptionForStaff };
