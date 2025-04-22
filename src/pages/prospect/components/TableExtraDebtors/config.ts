export interface dataTableExtraDebtors {
  id: string;
  documentType: string;
  documentNumber: number;
  names: string;
  lastName: string;
  income: number;
  expenses: number;
  email: string;
  phone: number;
  actions?: string;
  gender: string;
  trace_id?: string;
}

export const headers: {
  label: string;
  key: keyof dataTableExtraDebtors;
  action?: boolean;
}[] = [
  { label: "Tipo de documento", key: "documentType" },
  { label: "Numero de documento", key: "documentNumber" },
  { label: "Nombres", key: "names" },
  { label: "Apellidos", key: "lastName" },
  { label: "Ingresos", key: "income" },
  { label: "Egresos", key: "expenses" },
  { label: "Acciones", key: "actions", action: true },
];

export const dataReport = {
  noData:
    "Aún no hay adeudores extra registrados. Presione “Agregar deudor extra” para empezar.",
};
