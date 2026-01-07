export const ModalConfig = {
  closeButton: {
    code: "Modal_CloseButton",
    description: "Close button in modal",
    i18n: { en: "Close", es: "Cerrar" },
  },
  code: {
    code: "Modal_Code",
    description: "Label for obligation number",
    i18n: { en: "Obligation number", es: "Número de obligación" },
  },
  terminated: {
    code: "Modal_Terminated",
    description: "Label for next due date",
    i18n: { en: "Next due date", es: "Próximo vencimiento" },
  },
  selectedText: {
    code: "Modal_SelectedText",
    description: "Label for selected obligations",
    i18n: { en: "Selected obligations:", es: "Obligaciones seleccionadas:" },
  },
  newObligations: {
    code: "Modal_NewObligations",
    description: "Label when new obligations are found",
    i18n: {
      en: "New obligations found:",
      es: "Nuevas obligaciones encontradas:",
    },
  },
  newObligationsEmpty: {
    code: "Modal_NewObligationsEmpty",
    description: "Text when no new obligations are found",
    i18n: {
      en: "No new obligations found.",
      es: "No se encontraron nuevas obligaciones.",
    },
  },
  creditInvestment: {
    code: "Modal_CreditInvestment",
    description: "Label for free investment credit",
    i18n: { en: "Free investment credit", es: "Crédito libre inversión" },
  },
  close: {
    code: "Modal_Close",
    description: "Close button label",
    i18n: { en: "Close", es: "Cerrar" },
  },
  keep: {
    code: "Modal_Keep",
    description: "Button to save changes",
    i18n: { en: "Save", es: "Guardar" },
  },
  edit: {
    code: "Modal_Edit",
    description: "Button to edit obligations",
    i18n: { en: "Edit obligations", es: "Editar obligaciones" },
  },
  collectedValue: {
    code: "Modal_CollectedValue",
    description: "Label for total collected value",
    i18n: { en: "Total collected value.", es: "Valor total recogido." },
  },
  title: {
    code: "Modal_Title",
    description: "Modal title",
    i18n: { en: "Collected obligations", es: "Obligaciones recogidas" },
  },
  loading: {
    code: "Modal_Loading",
    description: "Loading text",
    i18n: { en: "Loading...", es: "Cargando..." },
  },
  noSelected: {
    code: "Modal_NoSelected",
    description: "Text when no obligations are selected",
    i18n: {
      en: "No obligations selected.",
      es: "No hay obligaciones seleccionadas.",
    },
  },
};

export const feedback = {
  fetchDataObligationPayment: {
    title: {
      code: "Feedback_FetchDataObligation_Title",
      description: "Title when failing to fetch obligation data",
      i18n: {
        en: "Error loading obligations",
        es: "Error al cargar obligaciones",
      },
    },
    description: {
      code: "Feedback_FetchDataObligation_Description",
      description: "Description when failing to fetch obligation data",
      i18n: {
        en: "Could not load payment obligations",
        es: "No se pudieron cargar las obligaciones de pago",
      },
    },
  },
  handleSaveChanges: {
    success: {
      title: {
        code: "Feedback_HandleSave_Success_Title",
        description: "Title when saving changes succeeds",
        i18n: { en: "Changes saved", es: "Cambios guardados" },
      },
      description: {
        code: "Feedback_HandleSave_Success_Description",
        description: "Description when saving changes succeeds",
        i18n: {
          en: "Consolidated credits were updated successfully",
          es: "Los créditos consolidados se actualizaron correctamente",
        },
      },
    },
    error: {
      title: {
        code: "Feedback_HandleSave_Error_Title",
        description: "Title when saving changes fails",
        i18n: { en: "Error saving changes", es: "Error al guardar cambios" },
      },
      description: {
        code: "Feedback_HandleSave_Error_Description",
        description: "Description when saving changes fails",
        i18n: {
          en: "Could not update consolidated credits",
          es: "No se pudieron actualizar los créditos consolidados",
        },
      },
    },
  },
};
