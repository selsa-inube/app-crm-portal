import { IExtraordinaryPayment } from "@services/types";

export const extraordinaryInstallmentMock: IExtraordinaryPayment[] = [
  {
    id: 1,
    datePayment: "2024-02-03",
    amount: 1500000,
    value: 1500000,
    paymentMethod: "Selsa",
    frequency: "Mensual",
  },
  {
    id: 2,
    datePayment: "2024-02-03",
    amount: 1500000,
    value: 1000000,
    paymentMethod: "Selsa",
    frequency: "Trimestral",
  },
  {
    id: 3,
    datePayment: "2024-02-03",
    amount: 1500000,
    value: 2000000,
    paymentMethod: "Prima",
    frequency: "Anual",
  },
];

export const paymentMethodOptionsMock = [
  {
    id: "bank_transfer",
    label: "Transferencia Bancaria",
    value: "Transferencia Bancaria",
  },
  {
    id: "credit_card",
    label: "Tarjeta de Crédito",
    value: "Tarjeta de Crédito",
  },
  { id: "cash", label: "Efectivo", value: "Efectivo" },
];

export const frequencyOptionsMock = [
  { id: "monthly", label: "Mensual", value: "Mensual" },
  { id: "quarterly", label: "Trimestral", value: "Trimestral" },
  { id: "annually", label: "Anual", value: "Anual" },
];
