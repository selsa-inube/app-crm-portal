export const dataTabsEnum = [
  {
    id: "Internal",
    label: {
      code: "Disbursement_tab_internal",
      description: "Internal account",
      i18n: {
        en: "Internal account",
        es: "Cuenta Interna",
      },
    },
  },
  {
    id: "External",
    label: {
      code: "Disbursement_tab_external",
      description: "External account",
      i18n: {
        en: "External account",
        es: "Cuenta Externa",
      },
    },
  },
  {
    id: "CheckEntity",
    label: {
      code: "Disbursement_tab_check_entity",
      description: "Entity check",
      i18n: {
        en: "Entity check",
        es: "Cheque Entidad",
      },
    },
  },
  {
    id: "CheckManagement",
    label: {
      code: "Disbursement_tab_check_management",
      description: "Management check",
      i18n: {
        en: "Management check",
        es: "Cheque Gerencia",
      },
    },
  },
  {
    id: "Cash",
    label: {
      code: "Disbursement_tab_cash",
      description: "Cash",
      i18n: {
        en: "Cash",
        es: "Efectivo",
      },
    },
  },
];

export const dataDisbursementEnum = {
  title: {
    code: "Disbursement_title",
    description: "Disbursement mode",
    i18n: {
      en: "Disbursement mode",
      es: "Forma de Desembolso",
    },
  },
  close: {
    code: "Disbursement_close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  noDataTitle: {
    code: "Disbursement_no_data_title",
    description: "No Disbursements modes found",
    i18n: {
      en: "No Disbursements modes found",
      es: "No se encontraron formas de desembolso",
    },
  },
  noDataDescription: {
    code: "Disbursement_no_data_description",
    description: "No disbursement modes available",
    i18n: {
      en: "No disbursement modes available",
      es: "No hay medios de desembolso disponibles para esta solicitud.",
    },
  },
  retry: {
    code: "Disbursement_retry",
    description: "Try again",
    i18n: {
      en: "Try again",
      es: "Volver a intentar",
    },
  },
};

export const disbursementGeneralEnum = {
  label: {
    code: "Disbursement_general_label",
    description: "Amount to be disbursed with this method",
    i18n: {
      en: "Amount to be disbursed with this method",
      es: "Valor a girar con esta forma de desembolso",
    },
  },
  place: {
    code: "Disbursement_general_placeholder",
    description: "Example: 1,000,000",
    i18n: {
      en: "Ex: 1,000,000",
      es: "Ej: 1.000.000",
    },
  },
  labelCheck: {
    code: "Disbursement_general_label_check",
    description:
      "The amount to be disbursed with this method is equal to the pending balance.",
    i18n: {
      en: "The amount to be disbursed with this method is equal to the pending balance.",
      es: "El valor a girar con esta forma de desembolso es igual al saldo pendiente por desembolsar.",
    },
  },
  labelToggle: {
    code: "Disbursement_general_toggle_label",
    description: "Disbursement is in the name of the borrower?",
    i18n: {
      en: "Disbursement to the client's name?",
      es: "¿Desembolso a nombre del cliente?",
    },
  },
  optionToggleYes: {
    code: "Disbursement_toggle_yes",
    description: "YES",
    i18n: {
      en: "YES",
      es: "SI",
    },
  },
  optionToggleNo: {
    code: "Disbursement_toggle_no",
    description: "NO",
    i18n: {
      en: "NO",
      es: "NO",
    },
  },
};

export const disbursemenOptionAccountEnum = {
  labelAccount: {
    code: "Disbursement_account_label",
    description: "Account to disburse the money",
    i18n: {
      en: "Account to disburse the money",
      es: "Cuenta para desembolsar el dinero",
    },
  },
  labelName: {
    code: "Disbursement_name_label",
    description: "First names",
    i18n: {
      en: "First names",
      es: "Nombres",
    },
  },
  placeName: {
    code: "Disbursement_name_placeholder",
    description: "Ex: Maria Camila",
    i18n: {
      en: "Ex: Maria Camila",
      es: "Ej: Maria Camila",
    },
  },
  labelLastName: {
    code: "Disbursement_last_name_label",
    description: "Last names",
    i18n: {
      en: "Last names",
      es: "Apellidos",
    },
  },
  placeLastName: {
    code: "Disbursement_last_name_placeholder",
    description: "Ex: Hernández Guerrero",
    i18n: {
      en: "Ex: Hernández Guerrero",
      es: "Ej: Hernández Guerrero",
    },
  },
  labelSex: {
    code: "Disbursement_sex_label",
    description: "Biological sex",
    i18n: {
      en: "Biological sex",
      es: "Sexo biológico",
    },
  },
  labelDocumentType: {
    code: "Disbursement_document_type_label",
    description: "Document type",
    i18n: {
      en: "Document type",
      es: "Tipo de documento",
    },
  },
  labelDocumentNumber: {
    code: "Disbursement_document_number_label",
    description: "Document number",
    i18n: {
      en: "Document number",
      es: "Número de documento",
    },
  },
  placeDocumentNumber: {
    code: "Disbursement_document_number_placeholder",
    description: "Ex: 1015744898",
    i18n: {
      en: "Ex: 1015744898",
      es: "Ej: 1015744898",
    },
  },
  labelBirthdate: {
    code: "Disbursement_birthdate_label",
    description: "Date of birth",
    i18n: {
      en: "Date of birth",
      es: "Fecha de nacimiento",
    },
  },
  labelphone: {
    code: "Disbursement_phone_label",
    description: "Contact phone",
    i18n: {
      en: "Contact phone",
      es: "Teléfono de contacto",
    },
  },
  placephone: {
    code: "Disbursement_phone_placeholder",
    description: "Ex: 3103217765",
    i18n: {
      en: "Ex: 3103217765",
      es: "Ej: 3103217765",
    },
  },
  labelMail: {
    code: "Disbursement_email_label",
    description: "Email",
    i18n: {
      en: "Email",
      es: "Correo electrónico",
    },
  },
  placeMail: {
    code: "Disbursement_email_placeholder",
    description: "Ex: myemail@mail.com",
    i18n: {
      en: "Ex: myemail@mail.com",
      es: "Ej: micorreo@mail.com",
    },
  },
  labelCity: {
    code: "Disbursement_city_label",
    description: "City of residence",
    i18n: {
      en: "City of residence",
      es: "Ciudad de residencia",
    },
  },
  labelBank: {
    code: "Disbursement_bank_label",
    description: "Bank",
    i18n: {
      en: "Bank",
      es: "Banco",
    },
  },
  labelAccountType: {
    code: "Disbursement_account_type_label",
    description: "Account type",
    i18n: {
      en: "Account type",
      es: "Tipo de cuenta",
    },
  },
  labelAccountNumber: {
    code: "Disbursement_account_number_label",
    description: "Account number",
    i18n: {
      en: "Account number",
      es: "Número de cuenta",
    },
  },
  placeAccountNumber: {
    code: "Disbursement_account_number_placeholder",
    description: "Ex: 1040 2200 3582",
    i18n: {
      en: "Ex: 1040 2200 3582",
      es: "Ej: 1040 2200 3582",
    },
  },
  observation: {
    code: "Disbursement_observation_label",
    description: "Observations",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },
  placeObservation: {
    code: "Disbursement_observation_placeholder",
    description: "Extra things to consider.",
    i18n: {
      en: "Extra things to consider.",
      es: "Comentarios extra a tener en cuenta.",
    },
  },
  placeOption: {
    code: "Disbursement_option_placeholder",
    description: "Select an option",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  paymentOrderReference: {
    code: "payment_order_reference",
    description: "payment order reference",
    i18n: {
      en: "payment order reference",
      es: "Orden de pago",
    },
  },
  disbursemerntRefernce: {
    code: "disbursemernt_refernce",
    description: "disbursemernt refernce",
    i18n: {
      en: "disbursemernt refernce",
      es: "Referencia de desembolso",
    },
  },
};
