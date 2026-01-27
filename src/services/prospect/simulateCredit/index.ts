import { environment } from "@config/environment";
import { IProspect } from "../types";

const postSimulateCredit = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  userAccount: string,
  simulateData: IProspect,
  authorizationToken: string,
): Promise<IProspect | undefined> => {
  const requestUrl = `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects`;

  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "X-Action": "SimulateCredit",
        "X-Business-Unit": businessUnitPublicCode,
        "X-User-Name": userAccount,
        "Content-type": "application/json; charset=UTF-8",
        "X-Process-Manager": businessManagerCode,
        Authorization: `${authorizationToken}`,
      },
      body: JSON.stringify(simulateData),
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
      const errorMessage = `Error al crear la solicitud de crédito: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to add credit request:", error);
    throw error;
  }
};

export { postSimulateCredit };
