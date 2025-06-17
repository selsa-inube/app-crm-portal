export interface IObligations {
  customerIdentificationNumber: string;
  customerIdentificationType: string;
  customerName: string;
  obligations: {
    balanceObligationTotal: number;
    duesPaid: number;
    entity: string;
    nextPaymentValueTotal: number;
    obligationNumber: string;
    outstandingDues: number;
    paymentMethodName: string;
    productName: string;
  }[];
}
