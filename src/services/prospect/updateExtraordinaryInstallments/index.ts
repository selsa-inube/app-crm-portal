import { environment } from "@config/environment";
import { IExtraordinaryInstallments } from "../types";
import { mapExtraordinaryInstallmentsEntity } from "./mappers";

const updateExtraordinaryInstallments = async (
  extraordinaryInstallments: IExtraordinaryInstallments,
  businessUnitPublicCode: string,
): Promise<IExtraordinaryInstallments | undefined> => {
  const requestUrl = `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects`;

  try {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "X-Action": "UpdateExtraordinaryInstallments",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(
        mapExtraordinaryInstallmentsEntity(extraordinaryInstallments),
      ),
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
      const errorMessage = `Error al editar cuotas extraordinarias. Status: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to patch extraordinary installments:", error);
    throw error;
  }
};

export { updateExtraordinaryInstallments };
