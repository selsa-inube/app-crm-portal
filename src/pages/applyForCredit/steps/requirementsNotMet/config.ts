export const dataNotMet = [
  {
    title: {
      code: "NotMet_title_1",
      description: "Alert title",
      i18n: {
        en: "Alert 1",
        es: "Alerta 1",
      },
    },
    requirement: {
      code: "NotMet_requirement_1",
      description: "Requirement description",
      i18n: {
        en: "Be up to date on obligations.",
        es: "Estar al día en las obligaciones.",
      },
    },
    causeNonCompliance: {
      code: "NotMet_causeNonCompliance_1",
      description: "Cause of non-compliance",
      i18n: {
        en: "The client has overdue housing credit.",
        es: "El cliente tiene en mora el crédito de vivienda.",
      },
    },
  },
  {
    title: {
      code: "NotMet_title_2",
      description: "Alert title",
      i18n: {
        en: "Alert 2",
        es: "Alerta 2",
      },
    },
    requirement: {
      code: "NotMet_requirement_2",
      description: "Requirement description",
      i18n: {
        en: "Requires 90 days of seniority.",
        es: "Requiere 90 días de antigüedad.",
      },
    },
    causeNonCompliance: {
      code: "NotMet_causeNonCompliance_2",
      description: "Cause of non-compliance",
      i18n: {
        en: "The client has only 60 days of affiliation.",
        es: "El cliente tiene solo 60 días de afiliación.",
      },
    },
  },
];

export const dataError = {
  titleError: {
    code: "NotMet_errorTitle",
    description: "Generic error title",
    i18n: {
      en: "Something went wrong",
      es: "Algo salió mal",
    },
  },
  descriptionError: {
    code: "NotMet_errorDescription",
    description: "Error loading requirements",
    i18n: {
      en: "The requirements for the request could not be retrieved.",
      es: "No se pudo obtener los requisitos de la solicitud.",
    },
  },
  noData: {
    code: "NotMet_noData",
    description: "No restrictions message",
    i18n: {
      en: "The client currently has no requirement restrictions.",
      es: "El cliente no presenta restricción por requisitos en este momento.",
    },
  },
  loadRequirements: {
    code: "NotMet_loading",
    description: "Loading requirements message",
    i18n: {
      en: "Loading requirements...",
      es: "Cargando requisitos...",
    },
  },
  alert: {
    code: "NotMet_alert",
    description: "Alert label",
    i18n: {
      en: "Alert",
      es: "Alerta",
    },
  },
};
