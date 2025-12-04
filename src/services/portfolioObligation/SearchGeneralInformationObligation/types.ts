interface IObligationValueBase {
  total: number;
}

interface IObligationDetailBase {
  obligationNumber: string;
  productName: string;
  paymentMethodName: string;
  paidQuotas: number;
  pendingQuotas: number;
  balanceObligation: IObligationValueBase;
  nextPaymentValue: IObligationValueBase;
}

export type IObligationDetail<
  TAdditionalProperties extends object = Record<string, never>,
> = IObligationDetailBase & TAdditionalProperties;
