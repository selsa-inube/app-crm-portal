import { IExtraordinaryPayment } from "@services/types";
interface IHeaders {
  label: string;
  key: keyof IExtraordinaryPayment;
  action?: boolean;
  mask?: (value: string | number) => string;
}

export type { IHeaders };
