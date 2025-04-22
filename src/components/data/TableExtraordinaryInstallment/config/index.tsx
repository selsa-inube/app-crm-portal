import { currencyFormat } from "@utils/formatData/currency";
import { IHeaders } from "@components/modals/ExtraordinaryPaymentModal/types";

export const rowsVisbleMobile = ["datePayment", "value", "actions"];

export const rowsActions = [
  {
    label: "Acciones",
    key: "actions",
  },
];

export const headersTableExtraordinaryInstallment: IHeaders[] = [
  {
    label: "Fecha de pago",
    key: "datePayment",
  },
  {
    label: "Valor",
    key: "value",
    mask: (value: string | number) => {
      return currencyFormat(value as number);
    },
  },
  {
    label: "Medio de pago",
    key: "paymentMethod",
  },
];

export const pageLength = 5;
