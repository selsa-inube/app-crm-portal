const obligationTypeOptions = [
  {
    id: "Consumo",
    value: "consumo",
    label: {
      code: "Obligation_consumption",
      description: "Consumption",
      i18n: {
        en: "Consumption",
        es: "Consumo",
      },
    },
  },
  {
    id: "Tarjeta",
    value: "tarjeta",
    label: {
      code: "Obligation_card",
      description: "Card",
      i18n: {
        en: "Card",
        es: "Tarjeta",
      },
    },
  },
  {
    id: "Vivienda",
    value: "vivienda",
    label: {
      code: "Obligation_housing",
      description: "Housing",
      i18n: {
        en: "Housing",
        es: "Vivienda",
      },
    },
  },
  {
    id: "Vehículo",
    value: "vehículo",
    label: {
      code: "Obligation_vehicle",
      description: "Vehicle",
      i18n: {
        en: "Vehicle",
        es: "Vehículo",
      },
    },
  },
  {
    id: "Otros",
    value: "otros",
    label: {
      code: "Obligation_other",
      description: "Other",
      i18n: {
        en: "Other",
        es: "Otros",
      },
    },
  },
];

const entityOptions = [
  {
    id: "Bancolombia",
    value: "bancolombia",
    label: {
      code: "Entity_bancolombia",
      description: "Bancolombia",
      i18n: {
        en: "Bancolombia",
        es: "Bancolombia",
      },
    },
  },
  {
    id: "Falabella",
    value: "falabella",
    label: {
      code: "Entity_falabella",
      description: "Falabella",
      i18n: {
        en: "Falabella",
        es: "Falabella",
      },
    },
  },
  {
    id: "Davivienda",
    value: "davivienda",
    label: {
      code: "Entity_davivienda",
      description: "Davivienda",
      i18n: {
        en: "Davivienda",
        es: "Davivienda",
      },
    },
  },
  {
    id: "Finandina",
    value: "finandina",
    label: {
      code: "Entity_finandina",
      description: "Finandina",
      i18n: {
        en: "Finandina",
        es: "Finandina",
      },
    },
  },
  {
    id: "Propio",
    value: "propio",
    label: {
      code: "Entity_own",
      description: "Own",
      i18n: {
        en: "Own",
        es: "Propio",
      },
    },
  },
];

const meansPaymentOptions = [
  {
    id: "Caja",
    value: "Caja",
    label: {
      code: "Payment_cash",
      description: "Cash",
      i18n: {
        en: "Cash",
        es: "Caja",
      },
    },
  },
  {
    id: "Nomina convencional",
    value: "nomina convencional",
    label: {
      code: "Payment_payroll",
      description: "Payroll",
      i18n: {
        en: "Payroll",
        es: "Nómina convencional",
      },
    },
  },
];

const dataInputs = {
  close: {
    code: "Close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  cancel: {
    code: "Cancel",
    description: "Cancel",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  labelType: {
    code: "Type_label",
    description: "Type",
    i18n: {
      en: "Type",
      es: "Tipo",
    },
  },
  labelEntity: {
    code: "Entity_label",
    description: "Entity",
    i18n: {
      en: "Entity",
      es: "Entidad",
    },
  },
  labelPayment: {
    code: "Payment_method_label",
    description: "Payment channel",
    i18n: {
      en: "Payment channel",
      es: "Medio de pago",
    },
  },
  placeHolderSelect: {
    code: "Select_placeholder",
    description: "Select option",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  labelFee: {
    code: "Loan_amount_label",
    description: "Loan amount",
    i18n: {
      en: "Loan amount",
      es: "Cuota",
    },
  },
  placeHolderFee: {
    code: "Fee_placeholder",
    description: "Fee value",
    i18n: {
      en: "Fee value",
      es: "Valor de la cuota",
    },
  },
  labelBalance: {
    code: "Balance_label",
    description: "Balance",
    i18n: {
      en: "Balance",
      es: "Saldo",
    },
  },
  placeHolderBalance: {
    code: "Balance_placeholder",
    description: "Total balance",
    i18n: {
      en: "Total value",
      es: "Valor total",
    },
  },
  labelId: {
    code: "Obligation_id_label",
    description: "Obligation number",
    i18n: {
      en: "Obligation number",
      es: "Número de obligación",
    },
  },
  placeHolderId: {
    code: "Obligation_id_placeholder",
    description: "Identifier",
    i18n: {
      en: "New obligation",
      es: "Nueva obligación",
    },
  },
  labelFeePaid: {
    code: "Paid_fees_label",
    description: "Paid installments",
    i18n: {
      en: "Paid installments",
      es: "Cuotas pagadas",
    },
  },
  palaceHolderFeePaid: {
    code: "Paid_fees_placeholder",
    description: "Paid installments placeholder",
    i18n: {
      en: "Paid fees",
      es: "Cuotas pagadas",
    },
  },
  labelterm: {
    code: "Term_label",
    description: "Term",
    i18n: {
      en: "Term",
      es: "Plazo",
    },
  },
  palaceHolderterm: {
    code: "Term_placeholder",
    description: "Total installments",
    i18n: {
      en: "Total installments",
      es: "Total de cuotas",
    },
  },
  errorBanks: {
    code: "DisbursementAccount_errorBanks",
    description: "Error loading banks",
    i18n: {
      en: "Error retrieving banks",
      es: "Error al obtener bancos",
    },
  },
  valueGreater: {
    code: "Value_greater_than_zero",
    description: "Value must be greater than 0",
    i18n: {
      en: "Value must be greater than 0",
      es: "El valor debe ser mayor a 0",
    },
  },
};

export {
  obligationTypeOptions,
  entityOptions,
  meansPaymentOptions,
  dataInputs,
};
