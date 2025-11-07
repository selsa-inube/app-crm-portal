export interface RowData {
  type: string;
  balance: string;
  fee: string;
  entity: string;
  payment: string;
  feePaid: string;
  actions: string;
  id: string;
  idUser: string;
}

export const headers: {
  label: string;
  key: keyof RowData;
  action?: boolean;
}[] = [
  { label: "Tipo", key: "type" },
  { label: "Saldo", key: "balance" },
  { label: "Cuota", key: "fee" },
  { label: "Entidad", key: "entity" },
  { label: "Medio de pago", key: "payment" },
  { label: "Id", key: "idUser" },
  { label: "Cuotas pagadas", key: "feePaid" },
  { label: "Acciones", key: "actions", action: true },
];

export const dataReport = {
  title: "Obligaciones financieras",
  description: "Camilo Alberto Rincon Jaramillo",
  addObligations: "Agregar obligaciones",
  noData: "No existen obligaciones financieras",
  descriptionTotalFee: "Cuota total.",
  descriptionTotalBalance: "Saldo total.",
  totalFee: "$ 3.300.000",
  totalBalance: "$ 87.000.000",
  close: "Cerrar",
  restore: "Restablecer",
  descriptionModal:
    "¿Realmente deseas restablecer los valores a su estado inicial?",
  save: "Guardar",
  edit: "Editar",
  deletion: "Eliminación",
  delete: "Eliminar",
  content: "¿Realmente deseas eliminar esta obligación?",
  cancel: "Cancelar",
  errorIncome: "Error al restablecer las fuentes de ingresos",
};

export function convertObligationsToProperties(
  obligationsFinancial: {
    balanceObligationTotal: number;
    duesPaid: number;
    entity: string;
    nextPaymentValueTotal: number;
    obligationNumber: string;
    outstandingDues: number;
    paymentMethodName: string;
    productName: string;
  }[],
): { propertyName: string; propertyValue: string }[] {
  return obligationsFinancial.map((obligation) => ({
    propertyName: "FinancialObligation",
    propertyValue: [
      obligation.productName ?? "",
      obligation.balanceObligationTotal ?? 0,
      obligation.nextPaymentValueTotal ?? 0,
      obligation.entity ?? "",
      obligation.paymentMethodName ?? "",
      obligation.obligationNumber ?? "",
      obligation.duesPaid ?? 0,
      obligation.outstandingDues ?? 0,
    ].join(", "),
  }));
}

export const errorMessages = {
  updateMessage: "Error al actualizar:",
};
