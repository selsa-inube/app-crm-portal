export const approvalsConfig = {
  title: {
    code: "Requirement_evaluation",
    description: "Requirement evaluation modal title",
    i18n: {
      en: "Requirement evaluation",
      es: "Evaluación del requisito",
    },
  },

  approval: {
    code: "Approval_question",
    description: "Approval question after evaluating the requirement",
    i18n: {
      en: "After evaluating the requirement, what is your answer?",
      es: "Después de evaluar el requisito, ¿Cuál es tu respuesta?",
    },
  },

  observations: {
    code: "Observations",
    description: "Observations label",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },

  observationDetails: {
    code: "Observation_details",
    description: "Observation details helper text",
    i18n: {
      en: "Provide details about the requirement evaluation",
      es: "Proporciona detalles acerca de la evaluación del requisito",
    },
  },

  answer: {
    code: "Answer",
    description: "Answer label",
    i18n: {
      en: "Answer",
      es: "Respuesta",
    },
  },

  answerPlaceholder: {
    code: "Select_answer",
    description: "Answer select placeholder",
    i18n: {
      en: "Select from the list",
      es: "Selecciona de la lista",
    },
  },

  cancel: {
    code: "Cancel",
    description: "Cancel action",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },

  confirm: {
    code: "Confirm",
    description: "Confirm action",
    i18n: {
      en: "Confirm",
      es: "Confirmar",
    },
  },

  titleError: {
    code: "Generic_error_title",
    description: "Generic error title",
    i18n: {
      en: "We are sorry for the inconvenience",
      es: "Lamentamos los inconvenientes",
    },
  },

  maxLength: 200,
};

export const optionsAnswer = [
  {
    id: "compliant",
    code: "Compliant",
    value: "COMPLIANT",
    i18n: {
      en: "Compliant",
      es: "Cumple",
    },
  },
  {
    id: "does_not_comply",
    code: "Not_compliant",
    value: "NOT_COMPLIANT",
    i18n: {
      en: "Does not comply",
      es: "No cumple",
    },
  },
  {
    id: "approve",
    code: "Approve",
    value: "APPROVE",
    i18n: {
      en: "Approve",
      es: "Aprobar",
    },
  },
  {
    id: "reject",
    code: "Reject_and_cancel",
    value: "REJECT",
    i18n: {
      en: "Does not comply and reject request",
      es: "No cumple y rechazar solicitud",
    },
  },
];
