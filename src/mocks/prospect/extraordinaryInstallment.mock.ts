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
    id: "comfandi_payroll_jun",
    label: "Prima Junio comfandi",
    value: "Prima Junio comfandi",
  },
  {
    id: "comfandi_payroll_dec",
    label: "Prima Diciembre comfandi",
    value: "Prima Diciembre comfandi",
  },
];

export const paymentDateOptionsMock = [
  {
    id: "dic",
    label: "15/Dic/2025",
    value: "15/Dic/2025",
  },
  {
    id: "Jun",
    label: "30/Jun/2026",
    value: "30/Jun/2026",
  },
];

export const frequencyOptionsMock = [
  { id: "semiannually", label: "Semestral", value: "Semestral" },
  { id: "annually", label: "Anual", value: "Anual" },
];
