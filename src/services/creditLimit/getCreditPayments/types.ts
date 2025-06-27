import { ITag } from "@inubekit/inubekit";

export interface IPaymentOption {
  label: string;
  description?: string;
  date?: Date;
  value: number;
  selected?: boolean;
  hidden?: boolean;
}

export interface IPayment {
  id: string;
  title: string;
  paymentMethod?: string;
  paymentMethodName: string;
  options: IPaymentOption[];
  tags: ITag[];
  valueToPay?: number;
  lineCode?: string;
  allowCustomValue?: boolean;
}

const otherValueAvailableDataDomain = {
  ALLOW: {
    id: "ALLOW",
    value: "En progreso",
  },
  NOT_ALLOW: {
    id: "DO_NOT_ALLOW",
    value: "Rechazado",
  },
};

const otherValueAvailableDMValueOf = (id: string) =>
  Object.values(otherValueAvailableDataDomain).find((value) => value.id === id);

const otherValueAvailableDM = {
  ...otherValueAvailableDataDomain,
  valueOf: otherValueAvailableDMValueOf,
};

enum EPaymentOptionType {
  EXPIREDVALUE = "EXPIREDVALUE",
  NEXTVALUE = "NEXTVALUE",
  TOTALVALUE = "TOTALVALUE",
  OTHERVALUE = "CAPITALCREDIT",
  UNSELECTALL = "UNSELECTALL",
  REPROGRAMMINGDEADLINE = "rmp",
  REPROGRAMMINGMAINTAININGVALUE = "rmc",
  REDUCEFUTUREQUOTA = "acf",
}

const paymentOptionValues: Record<string, string> = {
  [EPaymentOptionType.EXPIREDVALUE]: "Valor vencido",
  [EPaymentOptionType.NEXTVALUE]: "Próximo vencimiento",
  [EPaymentOptionType.TOTALVALUE]: "Pago total",
  [EPaymentOptionType.OTHERVALUE]: "Abono a capital",
  [EPaymentOptionType.REPROGRAMMINGDEADLINE]: "Reducir cuota",
  [EPaymentOptionType.REPROGRAMMINGMAINTAININGVALUE]: "Reducir plazo",
  [EPaymentOptionType.REDUCEFUTUREQUOTA]: "Pagar cuotas futuras",
};

export { otherValueAvailableDM, EPaymentOptionType, paymentOptionValues };
