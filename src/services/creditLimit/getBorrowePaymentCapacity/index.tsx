import { environment } from "@config/environment";

import { mapPaymentCapacityResponse } from "./mapper";
import { IPaymentCapacity, IPaymentCapacityResponse } from "./types";

const getBorrowerPaymentCapacityById = async (
  businessUnitPublicCode: string,
  data: IPaymentCapacity,
): Promise<IPaymentCapacityResponse | undefined> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-limits`;
  console.log(businessUnitPublicCode);
  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "X-Action": "GetBorrowerPaymentCapacityByIdentificationNumber",
        "X-Business-Unit": "fondecom", //businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(requestUrl, options);

    if (res.status === 204) {
      return;
    }

    let responseData: IPaymentCapacityResponse;
    try {
      responseData = await res.json();
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }

    if (!res.ok) {
      throw {
        message: "Error al obtener la capacidad de pago del deudor",
        status: res.status,
        data: responseData,
      };
    }

    const normalized = mapPaymentCapacityResponse(responseData);

    return normalized;
  } catch (error) {
    console.error("Failed to get borrower payment capacity:", error);
    throw error;
  }
};

export { getBorrowerPaymentCapacityById };
