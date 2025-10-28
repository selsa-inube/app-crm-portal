import { environment } from "@config/environment";
import { IMaximumCreditLimit } from "@src/services/creditRequest/types";

const postBusinessUnitRules = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  userAccount: string,
  submitData: IMaximumCreditLimit,
): Promise<IMaximumCreditLimit> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-limits/`;

  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "X-Action": "GetMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit",
        "X-Business-Unit": businessUnitPublicCode,
        "X-User-Name": userAccount,
        "Content-type": "application/json; charset=UTF-8",
        "X-Process-Manager": businessManagerCode,
      },
      body: JSON.stringify(submitData),
    };

    const res = await fetch(requestUrl, options);

    if (res.status === 204) {
      return {} as IMaximumCreditLimit;
    }

    let data;
    try {
      data = await res.json();
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }

    if (!res.ok) {
      const errorMessage = `Error al obtener los datos: ${
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
