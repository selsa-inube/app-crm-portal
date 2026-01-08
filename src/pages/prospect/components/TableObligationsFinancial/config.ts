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
  title: {
    code: "Title",
    description: "Title of the financial obligations report",
    i18n: {
      en: "Financial obligations",
      es: "Obligaciones financieras",
    },
  },
  description: {
    code: "Description",
    description: "Name of the borrower",
    i18n: {
      en: "Camilo Alberto Rincon Jaramillo",
      es: "Camilo Alberto Rincon Jaramillo",
    },
  },
  addObligations: {
    code: "Add_obligations",
    description: "Button to add new financial obligations",
    i18n: {
      en: "Add obligations",
      es: "Agregar obligaciones",
    },
  },
  noData: {
    code: "NoData",
    description: "Message shown when there are no financial obligations",
    i18n: {
      en: "No financial obligations",
      es: "No existen obligaciones financieras",
    },
  },
  descriptionTotalFee: {
    code: "Total_fee_description",
    description: "Label for total fee",
    i18n: {
      en: "Total fee.",
      es: "Cuota total.",
    },
  },
  descriptionTotalBalance: {
    code: "Total_balance_description",
    description: "Label for total balance",
    i18n: {
      en: "Total balance.",
      es: "Saldo total.",
    },
  },
  totalFee: {
    code: "Total_fee",
    description: "Total fee value",
    i18n: {
      en: "$ 3,300,000",
      es: "$ 3.300.000",
    },
  },
  totalBalance: {
    code: "Total_balance",
    description: "Total balance value",
    i18n: {
      en: "$ 87,000,000",
      es: "$ 87.000.000",
    },
  },
  close: {
    code: "Close",
    description: "Close button",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  restore: {
    code: "Restore",
    description: "Restore button to reset values",
    i18n: {
      en: "Restore",
      es: "Restablecer",
    },
  },
  descriptionModal: {
    code: "Restore_confirm",
    description: "Confirmation message for restoring values",
    i18n: {
      en: "Do you really want to restore values to their initial state?",
      es: "¿Realmente deseas restablecer los valores a su estado inicial?",
    },
  },
  save: {
    code: "Save",
    description: "Save button",
    i18n: {
      en: "Save",
      es: "Guardar",
    },
  },
  edit: {
    code: "Edit",
    description: "Edit button",
    i18n: {
      en: "Edit",
      es: "Editar",
    },
  },
  deletion: {
    code: "Deletion",
    description: "Title for delete action",
    i18n: {
      en: "Deletion",
      es: "Eliminación",
    },
  },
  delete: {
    code: "Delete",
    description: "Delete button",
    i18n: {
      en: "Delete",
      es: "Eliminar",
    },
  },
  content: {
    code: "Delete_confirm",
    description: "Confirmation message for deleting an obligation",
    i18n: {
      en: "Do you really want to delete this obligation?",
      es: "¿Realmente deseas eliminar esta obligación?",
    },
  },
  cancel: {
    code: "Cancel",
    description: "Cancel button",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  errorIncome: {
    code: "Error_income",
    description: "Error message when failing to restore income sources",
    i18n: {
      en: "Error restoring income sources",
      es: "Error al restablecer las fuentes de ingresos",
    },
  },
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
