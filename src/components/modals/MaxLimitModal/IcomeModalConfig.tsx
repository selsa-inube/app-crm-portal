export const incomeModalConfig = {
  title: {
    code: "Income_modal_title",
    description: "Maximum limit for vacation credit",
    i18n: {
      en: "Maximum limit per credit line",
      es: "Tope máx. por línea de crédito",
    },
  },

  loading: {
    code: "Loading_state",
    description: "Loading indicator",
    i18n: {
      en: "Loading...",
      es: "Cargando...",
    },
  },

  closeButton: {
    text: {
      code: "Close_button",
      description: "Close button text",
      i18n: {
        en: "Close",
        es: "Cerrar",
      },
    },
  },

  error: {
    title: {
      code: "Error_title",
      description: "Error loading data title",
      i18n: {
        en: "Error loading data",
        es: "Error cargando datos",
      },
    },
    message: {
      code: "Error_message",
      description: "Error loading data message",
      i18n: {
        en: "The data could not be loaded. Please try again later.",
        es: "No se pudieron cargar los datos. Intenta nuevamente más tarde.",
      },
    },
  },

  incomeSources: {
    label: {
      code: "Income_sources_label",
      description: "Total reported income sources",
      i18n: {
        en: "Total reported income sources",
        es: "Total fuentes de ingreso reportadas",
      },
    },
  },

  financialObligations: {
    label: {
      code: "Financial_obligations_label",
      description: "Maximum credit line limit",
      i18n: {
        en: "(+) Maximum limit for the credit line",
        es: "(+) Tope máximo para la línea de crédito",
      },
    },
  },

  subsistenceReserve: {
    label: {
      code: "Subsistence_reserve_label",
      description: "Current portfolio in credit line",
      i18n: {
        en: "(-) Current portfolio in the credit line",
        es: "(-) Cartera vigente en la línea de crédito",
      },
    },
  },

  availableCommitments: {
    label: {
      code: "Available_commitments_label",
      description: "Net available for new commitments",
      i18n: {
        en: "Net available for new commitments",
        es: "Neto disponible para nuevos compromisos",
      },
    },
  },

  maxVacationTerm: {
    label: {
      code: "Max_vacation_term_label",
      description: "Maximum vacation term",
      i18n: {
        en: "Maximum vacation term",
        es: "Plazo máx. en ‘vacaciones’",
      },
    },
  },

  textfield: {
    label: {
      code: "Max_amount_label",
      description: "Maximum amount label",
      i18n: {
        en: "Maximum amount",
        es: "Monto máximo",
      },
    },
    placeholder: {
      code: "Max_amount_placeholder",
      description: "Maximum amount placeholder",
      i18n: {
        en: "Enter the amount",
        es: "Ingrese la cantidad",
      },
    },
  },

  buttons: {
    close: {
      code: "Close_action",
      description: "Close action",
      i18n: {
        en: "Close",
        es: "Cerrar",
      },
    },
    recalculate: {
      code: "Recalculate_action",
      description: "Recalculate action",
      i18n: {
        en: "Recalculate",
        es: "Recalcular",
      },
    },
  },

  maxAmountQuote: {
    code: "Max_amount_quote",
    description: "Calculated maximum amount quote",
    i18n: {
      en: "Calculated maximum amount for selected installment and term.",
      es: (
        <>
          Monto máximo calculado para una cuota de
          <strong> $1'500.000 </strong> y plazo de <strong>60 </strong>
          meses.
        </>
      ),
    },
  },

  maxAmount: {
    code: "Max_amount_available",
    description: "Maximum available amount for credit line",
    i18n: {
      en: "Maximum available amount for the credit line",
      es: "Monto máximo disponible para la línea de crédito",
    },
  },
};
