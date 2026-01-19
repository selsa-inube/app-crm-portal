export const dataSubmitApplication = {
  borrowers: {
    stepName: {
      code: "SubmitApplication_borrowers_stepName",
      description: "Borrowers step name",
      i18n: {
        en: "Borrower data",
        es: "Datos de deudor/es",
      },
    },
    stepDescription: {
      code: "SubmitApplication_borrowers_stepDescription",
      description: "Borrowers step description",
      i18n: {
        en: "Add or update borrowers.",
        es: "Agregue o actualice a los deudores.",
      },
    },
    addButton: {
      code: "SubmitApplication_borrowers_addButton",
      description: "Add borrower button label",
      i18n: {
        en: "Add borrower",
        es: "Agregar deudor",
      },
    },
    borrowerLabel: {
      code: "SubmitApplication_borrowers_label",
      description: "Borrower label",
      i18n: {
        en: "Borrower",
        es: "Deudor",
      },
    },
  },

  coBorrowers: {
    stepName: {
      code: "SubmitApplication_coBorrowers_stepName",
      description: "Co-borrowers step name",
      i18n: {
        en: "Co-borrower data",
        es: "Datos de co-deudor/es",
      },
    },
    stepDescription: {
      code: "SubmitApplication_coBorrowers_stepDescription",
      description: "Co-borrowers step description",
      i18n: {
        en: "Add or update co-borrowers.",
        es: "Agregue o actualice a los co-deudores.",
      },
    },
    addButton: {
      code: "SubmitApplication_coBorrowers_addButton",
      description: "Add co-borrower button label",
      i18n: {
        en: "Add co-borrower",
        es: "Agregar co-deudor",
      },
    },
    borrowerLabel: {
      code: "SubmitApplication_coBorrowers_label",
      description: "Co-borrower label",
      i18n: {
        en: "Co-borrower",
        es: "Codeudor",
      },
    },
  },

  modals: {
    file: {
      code: "SubmitApplication_modal_file",
      description: "File application action",
      i18n: {
        en: "File",
        es: "Radicar",
      },
    },
    fileDescription: {
      code: "SubmitApplication_modal_fileDescription",
      description: "File application confirmation text",
      i18n: {
        en: "The credit application {numberProspectCode} will be filed. Do you want to continue?",
        es: "Se radicará la solicitud de crédito {numberProspectCode}. ¿Realmente deseas continuar?",
      },
    },
    continue: {
      code: "SubmitApplication_modal_continue",
      description: "Continue button label",
      i18n: {
        en: "Continue",
        es: "Continuar",
      },
    },
    cancel: {
      code: "SubmitApplication_modal_cancel",
      description: "Cancel button label",
      i18n: {
        en: "Close",
        es: "Cerrar",
      },
    },
    filed: {
      code: "SubmitApplication_modal_filed",
      description: "Filed status label",
      i18n: {
        en: "Filed",
        es: "Radicado",
      },
    },
    understand: {
      code: "SubmitApplication_modal_understand",
      description: "Understand button label",
      i18n: {
        en: "Understood",
        es: "Entendido",
      },
    },
    share: {
      code: "SubmitApplication_modal_share",
      description: "Share button label",
      i18n: {
        en: "Share",
        es: "Compartir",
      },
    },
    filedDescription: {
      code: "SubmitApplication_modal_filedDescription",
      description: "Filed confirmation description",
      i18n: {
        en: "The credit application was successfully filed and will be managed in the corresponding portal.",
        es: "La solicitud de crédito fue correctamente radicada y será gestionada en el portal correspondiente.",
      },
    },
  },

  cards: {
    destination: {
      code: "SubmitApplication_cards_destination",
      description: "Credit destination label",
      i18n: {
        en: "Destination:",
        es: "Destino: ",
      },
    },
  },

  error: {
    code: "SubmitApplication_error",
    description: "Error loading credit guarantees",
    i18n: {
      en: "An error occurred while loading credit guarantees.",
      es: "Ha ocurrido un error al cargar garantías de la solicitud de crédito.",
    },
  },

  creditProducts: {
    code: "SubmitApplication_creditProducts",
    description: "Credit products label",
    i18n: {
      en: "Credit products:",
      es: "Productos de crédito:",
    },
  },

  prospect: {
    code: "SubmitApplication_prospect",
    description: "Prospect label",
    i18n: {
      en: "Prospect",
      es: "Prospecto",
    },
  },

  net: {
    code: "SubmitApplication_net",
    description: "Net amount to be disbursed",
    i18n: {
      en: "Net to disburse:",
      es: "Neto a girar:",
    },
  },
};

export const prospectStates = {
  CREATED: {
    code: "ProspectState_created",
    description: "Prospect created state",
    i18n: {
      en: "Created",
      es: "Creado",
    },
  },
};

export const tittleOptions = {
  title: {
    code: "SubmitApplication_info_title",
    description: "Information modal title",
    i18n: {
      en: "Information",
      es: "Información",
    },
  },
  textButtonNext: {
    code: "SubmitApplication_info_next",
    description: "Next button label",
    i18n: {
      en: "Understood",
      es: "Entendido",
    },
  },
  titleError: {
    code: "SubmitApplication_error_title",
    description: "Error modal title",
    i18n: {
      en: "Oops, something went wrong!",
      es: "¡Uy, algo ha salido mal!",
    },
  },
  descriptionError: {
    code: "SubmitApplication_error_description",
    description: "Error description text",
    i18n: {
      en: "Changes could not be saved.",
      es: "No se han podido guardar los cambios.",
    },
  },
  errorSubmit: {
    code: "SubmitApplication_error_submit",
    description: "Error submitting application",
    i18n: {
      en: "The filing could not be sent correctly.",
      es: "El radicado no se ha podido enviar correctamente.",
    },
  },
  tryLater: {
    code: "SubmitApplication_error_tryLater",
    description: "Try later error message",
    i18n: {
      en: "We are having issues, please try again later.",
      es: "Estamos teniendo problemas, inténtalo más tarde.",
    },
  },
  errorSummaryProspect: {
    code: "SubmitApplication_error_summary",
    description: "Error loading prospect summary",
    i18n: {
      en: "Error loading prospect summary.",
      es: "Error al consultar el resumen del prospecto.",
    },
  },
  errorSharing: {
    code: "Error",
    description: "Error sharing PDF",
    i18n: { en: "Could not share PDF", es: "No se pudo compartir el PDF" },
  },
};
