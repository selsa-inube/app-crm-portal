export const disbursemenTabs = {
  internal: {
    id: "Internal_account",
    disabled: false,
    label: "Cuenta interna",
  },
  external: {
    id: "External_account",
    disabled: false,
    label: "Cuenta externa",
  },
};

export const disbursementGeneral = {
  label: "Valor a girar con esta forma de desembolso",
  place: "Ej: 1.000.000",
  description: 2000000,
  labelCheck:
    "El valor a girar con esta forma de desembolso es igual al saldo pendiente por desembolsar.",
  labelToggle: "¿El desembolso es a nombre propio?",
  optionToggleYes: "SI",
  optionToggleNo: "NO",
};

export const disbursemenOptionAccount = {
  labelAccount: "Cuenta para desembolsar el dinero",
  labelName: "Nombre",
  placeName: "Ej: Maria Camila",
  labelLastName: "Apellidos",
  placeLastName: "Ej: Hernández Guerrero",
  labelSex: "Sexo biológico",
  labelDocumentType: "Tipo de documento",
  labelDocumentNumber: "Número de documento",
  placeDocumentNumber: "Ej: 1015744898",
  labelBirthdate: "Fecha de nacimiento",
  labelphone: "Teléfono de contacto",
  placephone: "Ej: 3103217765",
  labelMail: "Correo electrónico",
  placeMail: "Ej: micorreo@mail.com",
  labelCity: "Ciudad de residencia",
  labelBank: "Banco",
  labelAccountType: "Tipo de cuenta",
  labelAccountNumber: "Número de cuenta",
  placeAccountNumber: "Ej: 1040 2200 3582",
  observation: "Observaciones",
  placeObservation: "Aspectos extra que deben tenerse en cuenta.",
  placeOption: "Selecciona una opción",
  valueTurnFail:
    "El valor a girar con esta forma de desembolso es diferente de ",
  errorFlagInternal: "Error al obtener cuentas internas",
  modal: {
    title: "Simulación de cupo",
    availableOnPayrollLabel: "Monto del préstamo a descontar en la nómina",
    availableOnPayrollValue: "2.000.000",
    prepaidInterest: "(-) Intereses anticipados",
    prepaidInterestValue: "-300.000",
    maximum: "Valor neto a girar",
    maximumValue: "1.700.000",
    value: "$",
    backButton: "Cerrar",
    settlement: "Liquidación de crédito",
  },
  modalOb: {
    title: "Información",
    description:
      "Si la cuenta donde deseas recibir el desembolso no está registrada, utiliza el campo de observaciones para describir la forma de desembolso que requieres. ",
    nexButton: "Entendido",
  },
};
