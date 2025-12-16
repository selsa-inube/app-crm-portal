export const dataRequestValue = {
  title: "Valor solicitado",
  place: "Ej: 1.000.000",
  description:
    "Tomando en cuenta el valor disponible, por favor escribe. ¿Cuál es el valor solicitado?",
  availableQuota: "$2.000.000",
  availableQuotaLabel: "Cupo disponible",
  borrower: "Nómina mensual SELSA",
  interestRate: "1,2% mensual",
  validation: {
    required: "El monto es obligatorio",
    typeError: "Debe ingresar un número válido",
    positive: "El monto debe ser positivo",
    min: "El monto debe ser mayor a 0",
    maxPrefix: "El monto no puede ser mayor al cupo disponible",
  },
};
