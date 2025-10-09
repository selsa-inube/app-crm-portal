import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

interface IFinancialObligation {
  balanceObligationTotal: number;
  duesPaid: number;
  entity: string;
  nextPaymentValueTotal: number;
  obligationNumber: string;
  outstandingDues: number;
  paymentMethodName: string;
  productName: string;
}

interface IRestorePayload {
  borrowerIdentificationNumber: string;
  financialObligations: IFinancialObligation[];
  justification: string;
  prospectCode: string;
}

export const restoreFinancialObligationsByBorrowerId = async (
  businessUnitPublicCode: string,
  borrowerIdentificationNumber: string,
  prospectCode: string,
  financialObligations: IFinancialObligation[],
  justification: string = "Restauración de obligaciones financieras",
): Promise<void> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  const payload: IRestorePayload = {
    borrowerIdentificationNumber,
    prospectCode,
    financialObligations,
    justification,
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "RestoreFinancialObligationsByBorrowerId",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo restaurar las fuentes de ingresos.",
        );
      }
    }
  }
};
