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
  title: "Deudor",
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
    "¿Realmente desea restablecer los valores a su estado inicial?",
  save: "Guardar",
  edit: "Editar",
  deletion: "Eliminación",
  delete: "Eliminar",
  content: "¿Realmente desea eliminar esta obligación?",
  cancel: "Cancelar",
};

export function convertObligationsToProperties(
  obligations: {
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
  return obligations.map((ob) => ({
    propertyName: "FinancialObligation",
    propertyValue: [
      ob.productName ?? "",
      ob.balanceObligationTotal ?? 0,
      ob.nextPaymentValueTotal ?? 0,
      ob.entity ?? "",
      ob.paymentMethodName ?? "",
      ob.obligationNumber ?? "",
      ob.duesPaid ?? 0,
      ob.outstandingDues ?? 0,
    ].join(", "),
  }));
}
