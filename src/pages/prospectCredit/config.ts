export const addConfig = {
  title: {
    code: "Title",
    description: "Title for credit prospects section",
    i18n: {
      en: "Processed applications",
      es: "Solicitudes tramitadas",
    },
  },
  route: {
    code: "Route",
    description: "Route path for credit prospects",
    i18n: {
      en: "/credit",
      es: "/credit",
    },
  },
  crumbs: [
    {
      path: "/home",
      label: {
        code: "Crumb_home",
        description: "Breadcrumb for home",
        i18n: {
          en: "Home",
          es: "Inicio",
        },
      },
      id: "/home",
      isActive: true,
    },
    {
      path: "/credit",
      label: {
        code: "Crumb_credit",
        description: "Breadcrumb for credit section",
        i18n: {
          en: "Credit",
          es: "Crédito",
        },
      },
      id: "/credito",
      isActive: false,
    },
    {
      path: "/credit/processed-credit-requests",
      label: {
        code: "Crumb_prospects",
        description: "Breadcrumb for credit prospects",
        i18n: {
          en: "Credit prospects",
          es: "Solicitudes tramitadas",
        },
      },
      id: "/prospectos",
      isActive: false,
    },
  ],
};

export const dataCreditProspects = {
  applyCredit: {
    code: "Apply_credit",
    description: "Button to apply for credit",
    i18n: {
      en: "Apply for credit",
      es: "Solicitar crédito",
    },
  },
  keyWord: {
    code: "Keyword",
    description: "Label for search by keyword",
    i18n: {
      en: "Keyword",
      es: "Palabra clave",
    },
  },
  errorCreditRequest: {
    code: "Error_credit_request",
    description: "Error message when failing to load credit requests",
    i18n: {
      en: "Could not load credit requests.",
      es: "No se han podido cargar las solicitudes de crédito.",
    },
  },
  titleError: {
    code: "Title_error",
    description: "Title for generic error",
    i18n: {
      en: "We regret the inconvenience",
      es: "Lamentamos los inconvenientes",
    },
  },
  accept: {
    code: "Accept",
    description: "Accept button",
    i18n: {
      en: "Accept",
      es: "Aceptar",
    },
  },
  cancel: {
    code: "Cancel",
    description: "Cancel button",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  sure: {
    code: "Sure",
    description: "Confirmation message before redirecting to another portal",
    i18n: {
      en: "This action will redirect you to another portal. Are you sure you want to continue?",
      es: "Esta acción te redirigirá a otro portal. ¿Seguro que deseas continuar?",
    },
  },
  creditApplication: {
    code: "Credit_application",
    description: "Label for credit application",
    i18n: {
      en: "Credit application",
      es: "Solicitud de crédito",
    },
  },
};

export const dataError = {
  notCredits: {
    code: "Not_credits",
    description: "Message when client has no credit requests",
    i18n: {
      en: "This client has no credit requests in progress.",
      es: "Este cliente aún no tiene ninguna solicitud de crédito en trámite.",
    },
  },
  noBusinessUnit: {
    code: "No_business_unit",
    description: "Message when there is no business unit",
    i18n: {
      en: "There is no business unit associated with the portal code.",
      es: "No hay una unidad de negocio relacionada con el código del portal.",
    },
  },
  noSelectClient: {
    code: "No_select_client",
    description: "Message when no client is selected",
    i18n: {
      en: "No client has been selected.",
      es: "No se ha seleccionado ningún cliente.",
    },
  },
};
