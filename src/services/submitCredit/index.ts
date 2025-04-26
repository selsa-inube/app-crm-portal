import { environment } from "@config/environment";

import { ISubmitCredit } from "./types";

const postSubmitCredit = async (
  businessUnitPublicCode: string,
  userAccount: string,
  submitData: FormData,
): Promise<ISubmitCredit | undefined> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`;

  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "X-Action": "SubmitCreditApplication",
        "X-Business-Unit": businessUnitPublicCode,
        "X-User-Name": userAccount,
      },
      body: submitData,
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

export { postSubmitCredit };
