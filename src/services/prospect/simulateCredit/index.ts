import { environment } from "@config/environment";

const postSimulateCredit = async (
  businessUnitPublicCode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simulateData: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | undefined> => {
  const requestUrl = `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects`;

  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "X-Action": "SimulateCredit",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
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
