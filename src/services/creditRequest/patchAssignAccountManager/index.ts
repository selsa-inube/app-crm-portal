import { environment } from "@config/environment";
import { ICreditRequests } from "../types";
import { mapCreditRequestsEntity } from "./mappers";

const patchAssignAccountManager = async (
  creditRequestId: string,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  userAccount: string,
): Promise<ICreditRequests | undefined> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`;
  try {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "X-Action": "AssignAccountManager",
        "X-Business-Unit": businessUnitPublicCode,
        "X-User-Name": userAccount,
        "Content-type": "application/json; charset=UTF-8",
        "X-Process-Manager": businessManagerCode,
      },
      body: JSON.stringify(mapCreditRequestsEntity(creditRequestId)),
    };

    const res = await fetch(requestUrl, options);

    if (res.status === 204) {
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }

    if (!res.ok) {
      const errorMessage = `Error en la asignación automática de funcionarios: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Error en la asignación automática de funcionarios:", error);
    throw error;
  }
};

export { patchAssignAccountManager };
