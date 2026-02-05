export const addConfiga = {
  id: 1,
  title: "Solicitudes de crédito",
  route: "/credit",
  crumbs: [
    {
      path: "/home",
      label: "Inicio",
      id: "/home",
      isActive: true,
    },
    {
      path: "/credit",
      label: "Crédito",
      id: "/credito",
      isActive: false,
    },
    {
      path: "/credit/credit-requests",
      label: "Solicitudes de crédito",
      id: "/prospectos",
      isActive: false,
    },
  ],
};

export const addConfig = {
  id: 1,
  title: {
    code: "Title",
    description: "Credit prospects title",
    i18n: {
      en: "Credit prospects",
      es: "Prospectos de crédito",
    },
  },
  route: "/credit/prospects",
  crumbs: [
    {
      path: "/home",
      label: {
        code: "Home_label",
        description: "Home breadcrumb label",
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
        code: "Credit_label",
        description: "Credit breadcrumb label",
        i18n: {
          en: "Credit",
          es: "Crédito",
        },
      },
      id: "/credito",
      isActive: false,
    },
    {
      path: "/credit/credit-requests",
      label: {
        code: "Credit_requests_label",
        description: "Credit requests breadcrumb label",
        i18n: {
          en: "Credit requests",
          es: "Solicitudes de crédito",
        },
      },
      id: "/prospectos",
      isActive: false,
    },
  ],
};

export const dataCreditProspects = {
  title: {
    code: "CreditProspects_title",
    description: "Credit prospects title",
    i18n: {
      en: "Error",
      es: "Error",
    },
  },
  applyCredit: {
    code: "CreditProspects_applyCredit",
    description: "Apply for credit button label",
    i18n: {
      en: "Apply for credit",
      es: "Solicitar crédito",
    },
  },

  keyWord: {
    code: "CreditProspects_keyWord",
    description: "Keyword search label",
    i18n: {
      en: "Keyword",
      es: "Palabra clave",
    },
  },

  errorCreditRequest: {
    code: "CreditProspects_errorCreditRequest",
    description: "Error loading credit requests",
    i18n: {
      en: "Credit requests could not be loaded.",
      es: "No se han podido cargar las solicitudes de crédito.",
    },
  },

  titleError: {
    code: "CreditProspects_titleError",
    description: "Generic error title",
    i18n: {
      en: "We are sorry for the inconvenience",
      es: "Lamentamos los inconvenientes",
    },
  },

  accept: {
    code: "CreditProspects_accept",
    description: "Accept action label",
    i18n: {
      en: "Accept",
      es: "Aceptar",
    },
  },

  cancel: {
    code: "CreditProspects_cancel",
    description: "Cancel action label",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },

  sure: {
    code: "CreditProspects_confirmation",
    description: "Redirect confirmation message",
    i18n: {
      en: "This action will redirect you to another portal. Are you sure you want to continue?",
      es: "Esta acción te redirigirá a otro portal. ¿Seguro que deseas continuar?",
    },
  },

  creditApplication: {
    code: "CreditProspects_creditApplication",
    description: "Credit application label",
    i18n: {
      en: "Credit application",
      es: "Solicitud de crédito",
    },
  },
};

export const dataError = {
  notCredits: {
    code: "CreditError_notCredits",
    description: "Client has no credit requests",
    i18n: {
      en: "This client does not have any credit requests in progress.",
      es: "Este cliente aún no tiene ninguna solicitud de crédito en trámite.",
    },
  },

  noBusinessUnit: {
    code: "CreditError_noBusinessUnit",
    description: "No business unit related to portal code",
    i18n: {
      en: "There is no business unit related to the portal code.",
      es: "No hay una unidad de negocio relacionada con el código del portal.",
    },
  },

  noSelectClient: {
    code: "CreditError_noSelectClient",
    description: "No client selected",
    i18n: {
      en: "No client has been selected.",
      es: "No se ha seleccionado ningún cliente.",
    },
  },
};

export const redirect = {
  portalName: {
    code: "Redirect_portalName",
    description: "Target portal name",
    i18n: {
      en: "Crediboard",
      es: "Crediboard",
    },
  },
  errorNoPortalsFound: {
    code: "Redirect_errorNoPortalsFound",
    description: "Error when no portals are found",
    i18n: {
      en: "No available portals found",
      es: "No se encontraron portales disponibles",
    },
  },
  errorInvalidPortalId: {
    code: "Redirect_errorInvalidPortalId",
    description: "Error when portal has no valid ID",
    i18n: {
      en: "The portal does not have a valid ID",
      es: "El portal no tiene un ID válido",
    },
  },
  errorCrediboardUrlNotConfigured: {
    code: "Redirect_errorCrediboardUrlNotConfigured",
    description: "Error when Crediboard URL is not configured",
    i18n: {
      en: "Crediboard URL not configured",
      es: "URL de Crediboard no configurada",
    },
  },
};
