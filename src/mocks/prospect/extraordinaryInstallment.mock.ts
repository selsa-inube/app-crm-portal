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
    id: "selsa_payroll_jun",
    label: "Prima Junio Selsa",
    value: "Prima Junio Selsa",
  },
  {
    id: "selsa_payroll_dec",
    label: "Prima Diciembre Selsa",
    value: "Prima Diciembre Selsa",
  },
];

export const frequencyOptionsMock = [
  { id: "semiannually", label: "Semestral", value: "Semestral" },
  { id: "annually", label: "Anual", value: "Anual" },
];
