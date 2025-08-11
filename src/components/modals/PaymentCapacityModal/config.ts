export const dataTabs = [
  { id: "ordinary", label: "Cuotas ordinarias" },
  { id: "extraordinary", label: "Cuotas extraordinarias" },
];

export const headers = [
  { label: "Concepto", key: "concept" },
  { label: "Valor", key: "value" },
  { label: "Fecha", key: "date" },
];

export const paymentCapacityData = {
  incomeSources: "(+) Total fuentes de ingreso reportadas",
  subsistenceReserve: "(-) Reserva mínima de subsistencia",
  newPromises: "(=) Neto disponible para nuevos compromisos",
  lineOfCredit: "(*) Plazo máx. en *Nombre línea de crédito*",
  maxValue:
    "Monto máximo calculado para una cuota de 2.000.000 y plazo de 20 meses.",
  maxValueDescription: "Monto máximo con cuotas ordinarias",
  maxValueAmount: "Monto máximo calculado para un plazo de 24 meses.",
  maxAmountOridinary: "Monto máximo con cuotas ordinarias",
  maxAmountExtraordinary:
    "Monto máximo sumando cuotas ordinarias y extraordinarias.",
  maxTotal: "Monto máximo total",
};
