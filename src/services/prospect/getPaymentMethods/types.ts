export interface IPaymentMethod {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentCycle {
  id: string;
  value: string;
  label: string;
}

export interface IFirstPaymentCycle {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentMethodsResponse {
  paymentMethods: IPaymentMethod[];
  paymentCycles: IPaymentCycle[];
  firstPaymentCycles: IFirstPaymentCycle[];
}
