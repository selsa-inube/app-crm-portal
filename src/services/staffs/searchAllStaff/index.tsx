import { environment } from "@config/environment";

import { mapStaffToEntity } from "./mappers";
import { IStaff } from "./types";

const getStaff = async (
  identificationDocumentNumber: string,
): Promise<IStaff[]> => {
  const queryParams = new URLSearchParams({
    identificationDocumentNumber: identificationDocumentNumber.substring(0, 20),
  });
  const requestUrl = `${environment.IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE}/staffs?${queryParams.toString()}`;

  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "X-Action": "SearchAllStaff",
        "Content-type": "application/json; charset=UTF-8",
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
      mapStaffToEntity(item),
    );
  } catch (error) {
    console.error(error);
  }

  return [];
};

export { getStaff };
