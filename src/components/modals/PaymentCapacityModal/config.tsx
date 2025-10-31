export const dataTabs = [
  { id: "ordinary", label: "Cuotas ordinarias" },
  { id: "extraordinary", label: "Cuotas extraordinarias" },
];

export const headers = [
  { label: "Concepto", key: "paymentChannelAbbreviatedName" },
  { label: "Valor", key: "installmentAmount" },
  { label: "Fecha", key: "installmentDate" },
];

export const paymentCapacityData = {
  incomeSources: "(+) Total fuentes de ingreso reportadas",
  subsistenceReserve: "(-) Reserva mínima de subsistencia",
  newPromises: "(=) Neto disponible para nuevos compromisos",
  lineOfCredit: "(x) Plazo máx. en *Nombre línea de crédito*",
  maxValueDescription: "Monto máximo con cuotas ordinarias",
  maxValueAmount: "Monto máximo calculado para un plazo de 24 meses.",
  maxAmountOridinary: "Monto máximo con cuotas ordinarias",
  maxAmountExtraordinary:
    "Monto máximo sumando cuotas ordinarias y extraordinarias.",
  maxTotal: "Monto máximo total",
  noExtraordinary: "No hay cuotas extraordinarias disponibles",
  errorDate: "Error al cargar datos",
  errorNoData:
    "No se pudo obtener la información de capacidad de pago. Por favor, intenta nuevamente.",
};
export const getMaxValueText = (maxAmount: number, maxTerm: number) => (
  <>
    Monto máximo calculado para una cuota de{" "}
    <strong>{maxAmount.toLocaleString("es-CO")}</strong> y plazo de{" "}
    <strong>{maxTerm}</strong> meses.
  </>
);
