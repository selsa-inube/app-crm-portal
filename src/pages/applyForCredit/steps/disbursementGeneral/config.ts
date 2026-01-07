export const disbursemenTabs = {
  internal: {
    id: "Internal_account",
    disabled: false,
    label: {
      code: "DisbursementTab_internal",
      description: "Internal account disbursement tab",
      i18n: {
        en: "Internal account",
        es: "Cuenta interna",
      },
    },
  },
  external: {
    id: "External_account",
    disabled: false,
    label: {
      code: "DisbursementTab_external",
      description: "External account disbursement tab",
      i18n: {
        en: "External account",
        es: "Cuenta externa",
      },
    },
  },
  check: {
    id: "Certified_check",
    disabled: false,
    label: {
      code: "DisbursementTab_certifiedCheck",
      description: "Certified check disbursement tab",
      i18n: {
        en: "Certified check",
        es: "Cheque entidad",
      },
    },
  },
  management: {
    id: "Business_check",
    disabled: false,
    label: {
      code: "DisbursementTab_managementCheck",
      description: "Management check disbursement tab",
      i18n: {
        en: "Management check",
        es: "Cheque de gerencia",
      },
    },
  },
  cash: {
    id: "Cash",
    disabled: false,
    label: {
      code: "DisbursementTab_cash",
      description: "Cash disbursement tab",
      i18n: {
        en: "Cash",
        es: "Dinero en efectivo",
      },
    },
  },
};

export const disbursementGeneral = {
  label: {
    code: "DisbursementGeneral_label",
    description: "Label for disbursement amount",
    i18n: {
      en: "Amount to be disbursed with this method",
      es: "Valor a girar con esta forma de desembolso",
    },
  },
  place: {
    code: "DisbursementGeneral_placeholder",
    description: "Placeholder for disbursement amount",
    i18n: {
      en: "E.g. 1,000,000",
      es: "Ej: 1.000.000",
    },
  },
  labelCheck: {
    code: "DisbursementGeneral_labelCheck",
    description: "Checkbox description for full disbursement",
    i18n: {
      en: "The amount to be disbursed with this method equals the pending balance.",
      es: "El valor a girar con esta forma de desembolso es igual al saldo pendiente por desembolsar.",
    },
  },
  labelToggle: {
    code: "DisbursementGeneral_labelToggle",
    description: "Toggle label for own-name disbursement",
    i18n: {
      en: "Is the disbursement in your own name?",
      es: "¿El desembolso es a nombre propio?",
    },
  },
  optionToggleYes: {
    code: "Common_yes",
    description: "Yes option",
    i18n: {
      en: "Yes",
      es: "Sí",
    },
  },
  optionToggleNo: {
    code: "Common_no",
    description: "No option",
    i18n: {
      en: "No",
      es: "No",
    },
  },
};

export const disbursemenOptionAccount = {
  labelAccount: {
    code: "DisbursementAccount_labelAccount",
    description: "Account selection label",
    i18n: {
      en: "Account to disburse funds",
      es: "Cuenta para desembolsar el dinero",
    },
  },
  labelName: {
    code: "DisbursementAccount_labelName",
    description: "First name label",
    i18n: {
      en: "First name",
      es: "Nombre",
    },
  },
  placeName: {
    code: "DisbursementAccount_placeName",
    description: "First name placeholder",
    i18n: {
      en: "E.g. Maria Camila",
      es: "Ej: Maria Camila",
    },
  },
  labelLastName: {
    code: "DisbursementAccount_labelLastName",
    description: "Last name label",
    i18n: {
      en: "Last name",
      es: "Apellidos",
    },
  },
  placeLastName: {
    code: "DisbursementAccount_placeLastName",
    description: "Last name placeholder",
    i18n: {
      en: "E.g. Hernández Guerrero",
      es: "Ej: Hernández Guerrero",
    },
  },
  labelSex: {
    code: "DisbursementAccount_labelSex",
    description: "Biological sex label",
    i18n: {
      en: "Biological sex",
      es: "Sexo biológico",
    },
  },
  labelDocumentType: {
    code: "DisbursementAccount_labelDocumentType",
    description: "Document type label",
    i18n: {
      en: "Document type",
      es: "Tipo de documento",
    },
  },
  labelDocumentNumber: {
    code: "DisbursementAccount_labelDocumentNumber",
    description: "Document number label",
    i18n: {
      en: "Document number",
      es: "Número de documento",
    },
  },
  placeDocumentNumber: {
    code: "DisbursementAccount_placeDocumentNumber",
    description: "Document number placeholder",
    i18n: {
      en: "E.g. 1015744898",
      es: "Ej: 1015744898",
    },
  },
  labelBirthdate: {
    code: "DisbursementAccount_labelBirthdate",
    description: "Birthdate label",
    i18n: {
      en: "Date of birth",
      es: "Fecha de nacimiento",
    },
  },
  labelphone: {
    code: "DisbursementAccount_labelPhone",
    description: "Contact phone label",
    i18n: {
      en: "Contact phone",
      es: "Teléfono de contacto",
    },
  },
  placephone: {
    code: "DisbursementAccount_placePhone",
    description: "Phone placeholder",
    i18n: {
      en: "E.g. 3103217765",
      es: "Ej: 3103217765",
    },
  },
  labelMail: {
    code: "DisbursementAccount_labelMail",
    description: "Email label",
    i18n: {
      en: "Email",
      es: "Correo electrónico",
    },
  },
  placeMail: {
    code: "DisbursementAccount_placeMail",
    description: "Email placeholder",
    i18n: {
      en: "E.g. myemail@mail.com",
      es: "Ej: micorreo@mail.com",
    },
  },
  labelCity: {
    code: "DisbursementAccount_labelCity",
    description: "City of residence label",
    i18n: {
      en: "City of residence",
      es: "Ciudad de residencia",
    },
  },
  labelBank: {
    code: "DisbursementAccount_labelBank",
    description: "Bank label",
    i18n: {
      en: "Bank",
      es: "Banco",
    },
  },
  labelAccountType: {
    code: "DisbursementAccount_labelAccountType",
    description: "Account type label",
    i18n: {
      en: "Account type",
      es: "Tipo de cuenta",
    },
  },
  labelAccountNumber: {
    code: "DisbursementAccount_labelAccountNumber",
    description: "Account number label",
    i18n: {
      en: "Account number",
      es: "Número de cuenta",
    },
  },
  placeAccountNumber: {
    code: "DisbursementAccount_placeAccountNumber",
    description: "Account number placeholder",
    i18n: {
      en: "E.g. 1040 2200 3582",
      es: "Ej: 1040 2200 3582",
    },
  },
  observation: {
    code: "DisbursementAccount_observation",
    description: "Observations label",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },
  placeObservation: {
    code: "DisbursementAccount_placeObservation",
    description: "Observations placeholder",
    i18n: {
      en: "Additional details to consider.",
      es: "Cosas extra que deben tenerse en cuenta.",
    },
  },
  placeOption: {
    code: "System_selectOption",
    description: "Select option placeholder",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  valueTurnFail: {
    code: "DisbursementAccount_valueTurnFail",
    description: "Mismatch disbursement value error",
    i18n: {
      en: "The amount to be disbursed with this method is different from",
      es: "El valor a girar con esta forma de desembolso es diferente de",
    },
  },
  errorFlagInternal: {
    code: "DisbursementAccount_errorInternalAccounts",
    description: "Error loading internal accounts",
    i18n: {
      en: "Error retrieving internal accounts",
      es: "Error al obtener cuentas internas",
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
};
