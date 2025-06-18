export interface IAttachedDocuments {
  borrower: string;
  value: string;
  attached: string;
  attach: string;
  download: string;
  remove: string;
}

export const headers: {
  label: string;
  key: keyof IAttachedDocuments;
  action?: boolean;
}[] = [
  { label: "Deudor", key: "borrower" },
  { label: "Documento solicitado", key: "value" },
  { label: "Adjunto", key: "attached" },
  { label: "Adjuntar", key: "attach", action: true },
  { label: "Descargar", key: "download", action: true },
  { label: "Quitar", key: "remove", action: true },
];

export const dataReport = {
  noData: "No existen documentos adjuntos",
  titleFlagDelete: "Eliminar",
  descriptionFlagDelete: "Se ha eliminado el archivo",
  delete: "Eliminar",
  close: "Cerrar",
  deleteText: "¿Estás seguro de Eliminar este documento?",
};
