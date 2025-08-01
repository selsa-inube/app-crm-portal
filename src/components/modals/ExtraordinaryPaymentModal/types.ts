interface IExtraordinaryPayment {
  id: number | string;
  datePayment: string;
  value: number;
  paymentMethod: string;
  amount?: number;
  frequency?: string;
}
interface IHeaders {
  label: string;
  key: keyof IExtraordinaryPayment;
  action?: boolean;
  mask?: (value: string | number) => string;
}

export type { IHeaders };
