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
    {
      path: `/credit/prospects/prospectCode`,
      label: {
        code: "Credit_prospects_label",
        description: "Credit prospects breadcrumb label",
        i18n: {
          en: "Credit prospects",
          es: "Prospectos de crédito",
        },
      },
      id: "/prospectosId",
      isActive: false,
    },
  ],
};

export const dataEditProspect = {
  creditProspect: {
    code: "Credit_prospect",
    description: "Label for credit prospect",
    i18n: { en: "Credit Prospect", es: "Prospecto de crédito" },
  },
  destination: {
    code: "Destination",
    description: "Destination label",
    i18n: { en: "Destination", es: "Destino" },
  },
  customer: {
    code: "Customer",
    description: "Customer label",
    i18n: { en: "Customer", es: "Cliente" },
  },
  value: {
    code: "Value_requested",
    description: "Requested value label",
    i18n: { en: "Requested Value", es: "Valor solicitado" },
  },
  delete: {
    code: "Delete_prospect",
    description: "Delete prospect action",
    i18n: { en: "Delete prospect", es: "Eliminar prospecto" },
  },
  confirm: {
    code: "Confirm_request",
    description: "Confirm credit request action",
    i18n: { en: "Confirm request", es: "Confirmar solicitud" },
  },
  errorCredit: {
    code: "Error_credit",
    description: "Error fetching credit requests",
    i18n: {
      en: "Error fetching credit requests",
      es: "Error al obtener las solicitudes de crédito",
    },
  },
  errorProspect: {
    code: "Error_prospect",
    description: "Error fetching prospect",
    i18n: {
      en: "Error fetching prospect",
      es: "Error al obtener el prospecto",
    },
  },
  errorRemoveProspect: {
    code: "Error_removeProspect",
    description: "Error removing prospect",
    i18n: {
      en: "Could not remove credit prospect",
      es: "No se ha podido eliminar el prospecto de crédito.",
    },
  },
  errorRecalculate: {
    code: "Error_recalculate",
    description: "Error recalculating prospect",
    i18n: {
      en: "Could not recalculate prospect",
      es: "No se ha podido recalcular el prospecto.",
    },
  },
  deleteTitle: {
    code: "Delete_title",
    description: "Title for delete modal",
    i18n: { en: "Delete prospect", es: "Eliminar prospecto" },
  },
  deleteDescription: {
    code: "Delete_description",
    description: "Description for delete modal",
    i18n: {
      en: "Do you really want to delete this credit prospect?",
      es: "¿Realmente deseas eliminar este prospecto de crédito?",
    },
  },
  nextButton: {
    code: "Next_button",
    description: "Next button label",
    i18n: { en: "Next", es: "Eliminar" },
  },
  backButton: {
    code: "Back_button",
    description: "Back button label",
    i18n: { en: "Back", es: "Cancelar" },
  },
};

export const titlesModal = {
  title: {
    code: "Title",
    description: "Modal main title",
    i18n: { en: "Information", es: "Información" },
  },
  subTitle: {
    code: "Sub_title",
    description: "Modal subtitle",
    i18n: { en: "Why is it disabled?", es: "¿Por qué está deshabilitado?" },
  },
  titlePrivileges: {
    code: "Title_privileges",
    description: "Title when lacking privileges",
    i18n: {
      en: "You do not have necessary privileges",
      es: "No cuenta con los privilegios necesarios para ejecutar esta acción.",
    },
  },
  titleRequest: {
    code: "Title_request",
    description: "Title when request already exists",
    i18n: {
      en: "Request already exists",
      es: "Ya existe una solicitud de crédito radicada con el mismo código de prospecto.",
    },
  },
  titleSubmitted: {
    code: "Title_submitted",
    description: "Title when prospect already submitted",
    i18n: {
      en: "Prospect already submitted",
      es: "El prospecto ya se encuentra radicado.",
    },
  },
  textButtonNext: {
    code: "Text_buttonNext",
    description: "Next button text",
    i18n: { en: "Understood", es: "Entendido" },
  },
};

export const labelsAndValuesShare = {
  titleOnPdf: {
    code: "Title_onPdf",
    description: "Title for PDF report",
    i18n: { en: "Commercial Management", es: "Gestión Comercial" },
  },
  fileName: {
    code: "File_name",
    description: "PDF file name",
    i18n: { en: "commercial_report.pdf", es: "reporte_comercial.pdf" },
  },
  text: {
    code: "Text",
    description: "Text to share in PDF",
    i18n: {
      en: "Commercial report to share",
      es: "Reporte Comercial para compartir",
    },
  },
  error: {
    code: "Error",
    description: "Error sharing PDF",
    i18n: { en: "Could not share PDF", es: "No se pudo compartir el PDF" },
  },
};

export const labelsRecalculateSimulation = {
  title: {
    code: "Title",
    description: "Recalculate simulation title",
    i18n: { en: "Recalculate simulation", es: "Recalcular simulación" },
  },
  description: {
    code: "Description",
    description: "Description for recalculation modal",
    i18n: {
      en: "The 'Recalculate simulation' function is irreversible, based on an optimized model and expected behavior includes:",
      es: "La función “Recalcular simulación” no es reversible, se basa en un modelo optimizado y el comportamiento esperado incluye:",
    },
  },
  list: {
    itemOne: {
      code: "List_itemOne",
      description: "First item in recalculation list",
      i18n: {
        en: "Automatic changes in prospect data",
        es: "Cambio en los datos del prospecto de forma automática.",
      },
    },
  },
  cancel: {
    code: "Cancel",
    description: "Cancel button",
    i18n: { en: "Cancel", es: "Cancelar" },
  },
  recalculate: {
    code: "Recalculate",
    description: "Recalculate button",
    i18n: { en: "Recalculate", es: "Recalcular" },
  },
  button: {
    code: "Button_recalculate",
    description: "Button text",
    i18n: { en: "Recalculate simulation", es: "Recalcular simulación" },
  },
};

export const requirementsMessageError = {
  code: "Error_requirements",
  description: "Error fetching requirements",
  i18n: {
    en: "Error fetching requirements",
    es: "Error al obtener los requisitos.",
  },
};

export const prerequisitesConfig = {
  prerequisitesNotMet: {
    code: "Prerequisites_not_met",
    description: "Prerequisites validation failed for credit application",
    i18n: {
      en: "The prospect does not meet the prerequisites for credit application",
      es: "El prospecto no cumple con los requisitos previos para solicitar crédito",
    },
  },
  errorValidatePrerequisites: {
    code: "Error_validate_prerequisites",
    description: "Error validating prerequisites",
    i18n: {
      en: "Error validating prerequisites",
      es: "Error al validar los requisitos previos",
    },
  },
};
