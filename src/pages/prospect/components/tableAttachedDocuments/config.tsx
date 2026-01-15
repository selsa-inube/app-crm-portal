export interface IAttachedDocuments {
  borrower: string;
  value: string;
  attached: string;
  attach: string;
  download: string;
  remove: string;
  actions: string;
}

export const headers = [
  {
    label: {
      code: "Borrower",
      description: "Header for debtor column",
      i18n: { en: "Borrower", es: "Deudor" },
    },
    key: "borrower" as const,
  },
  {
    label: {
      code: "RequestedDocument",
      description: "Header for requested document column",
      i18n: { en: "Requested Document", es: "Documento solicitado" },
    },
    key: "value" as const,
  },
  {
    label: {
      code: "Attach",
      description: "Header for attach actions column",
      i18n: { en: "Attach", es: "Adjuntar" },
    },
    key: "actions" as const,
    action: true,
  },
];

export const dataReport = {
  noData: {
    code: "NoData",
    description: "Message when no documents are available",
    i18n: {
      en: "No required documents.",
      es: "No hay requistos documentales.",
    },
  },
  titleFlagDelete: {
    code: "DeleteTitle",
    description: "Title for delete flag",
    i18n: { en: "Delete", es: "Eliminar" },
  },
  descriptionFlagDelete: {
    code: "DeleteDescription",
    description: "Description after deleting a file",
    i18n: { en: "The file has been deleted", es: "Se ha eliminado el archivo" },
  },
  delete: {
    code: "Delete",
    description: "Delete button text",
    i18n: { en: "Delete", es: "Eliminar" },
  },
  close: {
    code: "Close",
    description: "Close button text",
    i18n: { en: "Close", es: "Cerrar" },
  },
  deleteText: {
    code: "DeleteConfirm",
    description: "Confirmation text when deleting a document",
    i18n: {
      en: "Are you sure you want to delete this document?",
      es: "¿Estás seguro de Eliminar este documento?",
    },
  },
  loading: {
    code: "Loading",
    description: "Message shown when documents are loading",
    i18n: {
      en: "Loading required documents...",
      es: "Cargando documentos requeridos...",
    },
  },
};
