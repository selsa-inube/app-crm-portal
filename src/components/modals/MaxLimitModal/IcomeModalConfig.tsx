export const incomeModalConfig = {
  closeButton: {
    text: "Cerrar",
  },
  error: {
    title: "Error cargando datos",
    message:
      "No se pudieron cargar los datos. Por favor, intente nuevamente más tarde.",
  },
  incomeSources: {
    label: "Total fuentes de ingreso reportadas",
  },
  financialObligations: {
    label: "(+) Tope máximo para la línea de crédito",
  },
  subsistenceReserve: {
    label: "(-) Cartera vigente en la línea de crédito",
  },
  availableCommitments: {
    label: "Neto disponible para nuevos compromisos",
  },
  maxVacationTerm: {
    label: "Plazo máx. en ‘vacaciones’",
  },
  textfield: {
    label: "Monto máximo",
    placeholder: "Ingrese la cantidad",
  },
  buttons: {
    close: "Cerrar",
    recalculate: "Recalcular",
  },
  maxAmountQuote: (
    <>
      Monto máximo calculado para una cuota de
      <strong> $1'500.000 </strong> y plazo de <strong>60 </strong>
      meses.
    </>
  ),
  maxAmount: "Monto máximo disponible para la línea de crédito",
};
