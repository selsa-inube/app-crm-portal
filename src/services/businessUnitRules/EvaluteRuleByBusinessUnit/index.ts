import { environment } from "@config/environment";

import { IBusinessUnitRules } from "../types";

const postBusinessUnitRules = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  submitData: IBusinessUnitRules,
): Promise<IBusinessUnitRules> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/business-unit-rules`;

  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "X-Action": "EvaluteRuleByBusinessUnit",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
        "X-Process-Manager": businessManagerCode,
      },
      body: JSON.stringify(submitData),
    };

    const res = await fetch(requestUrl, options);

    if (res.status === 204) {
      return {} as IBusinessUnitRules;
    }

    let data;
    try {
      data = await res.json();
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }

    if (!res.ok) {
      const errorMessage = `Error al evaluar la regla de negocio Status: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to evaluate rule:", error);
    throw error;
  }
};

export { postBusinessUnitRules };
