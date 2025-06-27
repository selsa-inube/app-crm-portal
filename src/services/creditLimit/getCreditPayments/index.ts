import { environment } from "@config/environment";

import { IPayment } from "./types";
import { mapCreditPaymentsApiToEntities } from "./mappers";

const getCreditPayments = async (
  userIdentification: string,
  businessUnitPublicCode: string,
): Promise<IPayment[]> => {
  try {
    const queryParams = new URLSearchParams({
      customerCode: userIdentification,
    });
    console.log("en getCreditPayments--> ", businessUnitPublicCode);
    const options: RequestInit = {
      method: "GET",
      headers: {
        "X-Action": "SearchAllPortfolioObligationPayment",
        "X-Business-Unit": "fondecom", // businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const res = await fetch(
      `${
        environment.VITE_ICLIENT_QUERY_PROCESS_SERVICE
      }/portfolio-obligations/payment?${queryParams.toString()}`,
      options,
    );

    if (res.status === 204) {
      return [];
    }

    if (!res.ok) {
      throw {
        message: "Error al obtener los pagos de obligaciones.",
        status: res.status,
      };
    }

    const data = await res.json();

    const normalizedCreditPayments = Array.isArray(data)
      ? mapCreditPaymentsApiToEntities(data)
      : [];

    console.log(
      "data payments normalizedCreditPayments: ",
      normalizedCreditPayments,
    );
    return normalizedCreditPayments;
  } catch (error) {
    console.info(error);

    throw error;
  }
};

export { getCreditPayments };
