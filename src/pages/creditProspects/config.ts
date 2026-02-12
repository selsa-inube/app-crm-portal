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
  route: "/credit",
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
      path: "/credit/prospects",
      label: {
        code: "Credit_prospects_label",
        description: "Credit prospects breadcrumb label",
        i18n: {
          en: "Credit prospects",
          es: "Prospectos de crédito",
        },
      },
      id: "/prospectos",
      isActive: false,
    },
  ],
};

export const dataCreditProspects = {
  simulate: {
    code: "Simulate",
    description: "Simulation action",
    i18n: {
      en: "Simulate credit",
      es: "Simular crédito",
    },
  },
  keyWord: {
    code: "Key_word",
    description: "Keyword label",
    i18n: {
      en: "Keyword",
      es: "Palabra clave",
    },
  },
  messageTitle: {
    code: "Message_title",
    description: "Observations title",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },
  moneyDesination: {
    code: "Money_desination",
    description: "Money destination label",
    i18n: {
      en: "Money destination",
      es: "Destino del dinero",
    },
  },
  clientComments: {
    code: "Client_comments",
    description: "Client comments label",
    i18n: {
      en: "Client comments",
      es: "Observaciones del cliente",
    },
  },
  errorObservations: {
    code: "Error_observations",
    description: "Error updating prospect comment",
    i18n: {
      en: "Error updating prospect comment",
      es: "Error al actualizar comentario del prospecto",
    },
  },
  confirmTitle: {
    code: "Confirm_title",
    description: "Prospect confirmation title",
    i18n: {
      en: "Prospect confirmation",
      es: "Confirmación de prospecto",
    },
  },
  confirmDescription: {
    code: "Confirm_description",
    description: "Confirmation prompt text",
    i18n: {
      en: "Do you really want to confirm this credit prospect?",
      es: "¿Realmente deseas confirmar este prospecto de crédito?",
    },
  },
  deleteTitle: {
    code: "Delete_title",
    description: "Delete prospect title",
    i18n: {
      en: "Delete prospect",
      es: "Eliminar prospecto",
    },
  },
  deleteDescription: {
    code: "Delete_description",
    description: "Delete prompt text",
    i18n: {
      en: "Do you really want to delete this credit prospect?",
      es: "¿Realmente deseas eliminar este prospecto de crédito?",
    },
  },
  confirm: {
    code: "Confirm",
    description: "Confirm button",
    i18n: {
      en: "Confirm",
      es: "Confirmar",
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
  errorCreditProspect: {
    code: "Error_credit_prospect",
    description: "Error loading prospects",
    i18n: {
      en: "Could not load credit prospects.",
      es: "No se han podido cargar los prospectos de credito.",
    },
  },
  errorRemoveProspect: {
    code: "Error_remove_prospect",
    description: "Error deleting prospect",
    i18n: {
      en: "Could not delete the credit prospect.",
      es: "No se ha podido eliminar el prospecto de crédito.",
    },
  },
  close: {
    code: "Close",
    description: "Close button",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  modify: {
    code: "Modify",
    description: "Modify observations button",
    i18n: {
      en: "Modify observations",
      es: "Modificar observaciones",
    },
  },
  preanalysis: {
    code: "Preanalysis",
    description: "Pre-analysis comments",
    i18n: {
      en: "Pre-analysis comments",
      es: "Comentarios del pre-análisis",
    },
  },
  preApproval: {
    code: "Pre_approval",
    description: "Pre-approval comments",
    i18n: {
      en: "Pre-approval comments",
      es: "Comentarios de la pre-aprobación",
    },
  },
  notHaveObservations: {
    code: "Not_have_observations",
    description: "No observations text",
    i18n: {
      en: "No observations",
      es: "No hay observaciones",
    },
  },
  notHaveComments: {
    code: "Not_have_comments",
    description: "No comments text",
    i18n: {
      en: "No comments",
      es: "No hay comentarios",
    },
  },
  none: {
    code: "None",
    description: "None placeholder",
    i18n: {
      en: "-",
      es: "-",
    },
  },
  titleFlagDelete: {
    code: "Title_flag_delete",
    description: "Delete flag title",
    i18n: {
      en: "Delete",
      es: "Eliminar",
    },
  },
  descriptionFlagDelete: {
    code: "Description_flag_delete",
    description: "Delete success notification",
    i18n: {
      en: "The credit prospect has been deleted",
      es: "El prospecto de crédito se ha eliminado",
    },
  },
  titleFlagComment: {
    code: "Title_flag_comment",
    description: "Comments flag title",
    i18n: {
      en: "Comments",
      es: "Comentarios",
    },
  },
  descriptionFlagComment: {
    code: "Description_flag_comment",
    description: "Comments update notification",
    i18n: {
      en: "Comments have been updated",
      es: "Los comentarios se han actualizado",
    },
  },
  errorCheckIfSimulationIsAllowed: {
    code: "Error_check_if_simulation_is_allowed",
    description: "Simulation requirement validation error",
    i18n: {
      en: "Error validating requirements for credit simulation.",
      es: "Error al validar los requisitos para la simulación de crédito.",
    },
  },
  requirementsNotMet: {
    code: "Requirements_not_met",
    description: "Requirements not met message",
    i18n: {
      en: "The client does not meet the requirements for simulation.",
      es: "El cliente no cumple con los requisitos para la simulación.",
    },
  },
  search: {
    code: "Search",
    description: "Search placeholder",
    i18n: {
      en: "Search",
      es: "Buscar",
    },
  },
  errorValidatePrerequisites: {
    code: "Error_validate_prerequisites",
    description: "Error validating credit application prerequisites",
    i18n: {
      en: "Error validating prerequisites for credit application. Please try again.",
      es: "Error al validar los prerrequisitos para la solicitud de crédito. Por favor, intente nuevamente.",
    },
  },
  prerequisitesNotMet: {
    code: "Prerequisites_not_met",
    description: "Prerequisites not met for credit application",
    i18n: {
      en: "Cannot proceed with the credit application. The necessary prerequisites are not met.",
      es: "No se puede proceder con la solicitud de crédito. No se cumplen los prerrequisitos necesarios.",
    },
  },
};

export const notFound = "Este cliente no tiene prospectos por gestionar.";

export const amountLineOnSkeletons = 4;

export const amountContainerOnSkeletons = 5;
