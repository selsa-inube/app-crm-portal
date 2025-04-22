const obligationTypeOptions = [
  {
    id: "Consumo",
    label: "Consumo",
    value: "consumo",
  },
  {
    id: "Tarjeta",
    label: "Tarjeta",
    value: "tarjeta",
  },
  {
    id: "Vivienda",
    label: "Vivienda",
    value: "vivienda",
  },
  {
    id: "Vehículo",
    label: "Vehículo",
    value: "vehículo",
  },
  {
    id: "Otros",
    label: "Otros",
    value: "otros",
  },
];

const entityOptions = [
  {
    id: "Bancolombia",
    label: "Bancolombia",
    value: "bancolombia",
  },
  {
    id: "Falabella",
    label: "Falabella",
    value: "falabella",
  },
  {
    id: "Davivienda",
    label: "Davivienda",
    value: "davivienda",
  },
  {
    id: "Finandina",
    label: "Finandina",
    value: "finandina",
  },
  {
    id: "Propio",
    label: "Propio",
    value: "propio",
  },
];

const meansPaymentOptions = [
  {
    id: "Caja",
    label: "Caja",
    value: "Caja",
  },
  {
    id: "Nomina convencional",
    label: "Nomina convencional",
    value: "nomina convencional",
  },
];

const dataInputs = {
  close: "Cerrar",
  cancel: "Cancelar",
  labelType: "Tipo",
  labelEntity: "Entidad",
  labelPayment: "Medio de pago",
  palaceHolderSelect: "Seleccione una opción",
  labelFee: "Cuota",
  palaceHolderFee: "Valor de la cuota",
  labelBalance: "Saldo",
  palaceHolderBalance: "Valor total",
  labelId: "Id",
  palaceHolderId: "Identificador",
  labelFeePaid: "Cuotas pagadas",
  palaceHolderFeePaid: "Cuotas pagadas",
  labelterm: "plazo",
  palaceHolderterm: "Total de cuotas",
};

export {
  obligationTypeOptions,
  entityOptions,
  meansPaymentOptions,
  dataInputs,
};
