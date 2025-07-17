export const headers = [
  { label: "Código", key: "codigo" },
  { label: "Fecha de solicitud", key: "fecha" },
  { label: "Destino", key: "destino" },
  { label: "Valor", key: "valor" },
  { label: "Acciones", key: "acciones", action: true },
];

export const tableConfig = {
  headers: [
    { label: "Código", key: "code" },
    { label: "Fecha de solicitud", key: "date" },
    { label: "Destino", key: "destination" },
    { label: "Valor", key: "value" },
    { label: "Acciones", key: "actions", action: true },
  ],
  messages: {
    noDataAvailable: "No hay datos disponibles",
    notAvailable: "N/A",
  },
};
