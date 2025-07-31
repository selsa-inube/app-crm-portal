import { IPaymentCapacityResponse } from "../types";

export const mapPaymentCapacityResponse = (
  response: IPaymentCapacityResponse,
): IPaymentCapacityResponse => {
  return {
    ...response,
    livingExpenseToIncomeRatiosResponse:
      response.livingExpenseToIncomeRatiosResponse.map((item) => ({
        ...item,
      })),
    paymentsCapacityResponse: response.paymentsCapacityResponse.map((item) => ({
      ...item,
    })),
  };
};
