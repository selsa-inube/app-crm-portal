export const dataTabs = [
  {
    id: "ordinary",
    label: {
      code: "Ordinary_installments_tab",
      description: "Ordinary installments tab",
      i18n: {
        en: "Ordinary installments",
        es: "Cuotas ordinarias",
      },
    },
  },
  {
    id: "extraordinary",
    label: {
      code: "Extraordinary_installments_tab",
      description: "Extraordinary installments tab",
      i18n: {
        en: "Extraordinary installments",
        es: "Cuotas extraordinarias",
      },
    },
  },
];

export const headers = [
  {
    key: "paymentChannelAbbreviatedName",
    label: {
      code: "Concept_header",
      description: "Concept column header",
      i18n: {
        en: "Concept",
        es: "Concepto",
      },
    },
  },
  {
    key: "installmentAmount",
    label: {
      code: "Amount_header",
      description: "Amount column header",
      i18n: {
        en: "Amount",
        es: "Valor",
      },
    },
  },
  {
    key: "installmentDate",
    label: {
      code: "Date_header",
      description: "Date column header",
      i18n: {
        en: "Date",
        es: "Fecha",
      },
    },
  },
];

export const paymentCapacityData = {
  incomeSources: {
    code: "Income_sources_total",
    description: "Total reported income sources",
    i18n: {
      en: "(+) Total reported income sources",
      es: "(+) Total fuentes de ingreso reportadas",
    },
  },

  subsistenceReserve: {
    code: "Subsistence_reserve_minimum",
    description: "Minimum subsistence reserve",
    i18n: {
      en: "(-) Minimum subsistence reserve",
      es: "(-) Reserva mínima de subsistencia",
    },
  },

  newPromises: {
    code: "New_commitments_net",
    description: "Net available for new commitments",
    i18n: {
      en: "(=) Net available for new commitments",
      es: "(=) Neto disponible para nuevos compromisos",
    },
  },

  getLineOfCredit: (nombreLinea: string) => `(x) Plazo máx. en ${nombreLinea}`,

  maxValueDescription: {
    code: "Max_value_ordinary_description",
    description: "Maximum value with ordinary installments",
    i18n: {
      en: "Maximum amount with ordinary installments",
      es: "Monto máximo con cuotas ordinarias",
    },
  },

  maxValueAmount: {
    code: "Max_value_amount",
    description: "Maximum calculated amount description",
    i18n: {
      en: "Maximum amount calculated for a 24-month term.",
      es: "Monto máximo calculado para un plazo de 24 meses.",
    },
  },

  maxAmountOridinary: {
    code: "Max_amount_ordinary",
    description: "Maximum amount with ordinary installments",
    i18n: {
      en: "Maximum amount with ordinary installments",
      es: "Monto máximo con cuotas ordinarias",
    },
  },

  maxAmountExtraordinary: {
    code: "Max_amount_extraordinary",
    description: "Maximum amount with ordinary and extraordinary installments",
    i18n: {
      en: "Maximum amount including ordinary and extraordinary installments",
      es: "Monto máximo sumando cuotas ordinarias y extraordinarias.",
    },
  },

  maxTotal: {
    code: "Max_total_amount",
    description: "Maximum total amount",
    i18n: {
      en: "Maximum total amount",
      es: "Monto máximo total",
    },
  },

  noExtraordinary: {
    code: "No_extraordinary_installments",
    description: "No extraordinary installments available",
    i18n: {
      en: "No extraordinary installments available",
      es: "No hay cuotas extraordinarias disponibles",
    },
  },

  errorDate: {
    code: "Error_loading_data",
    description: "Error loading data",
    i18n: {
      en: "Error loading data",
      es: "Error al cargar datos",
    },
  },

  errorNoData: {
    code: "Error_no_capacity_data",
    description: "Error retrieving payment capacity data",
    i18n: {
      en: "Payment capacity information could not be retrieved. Please try again.",
      es: "No se pudo obtener la información de capacidad de pago. Por favor, intenta nuevamente.",
    },
  },
};

export const getMaxValueText = (maxAmount: number, maxTerm: number) => (
  <>
    Monto máximo calculado para una cuota de{" "}
    <strong>{maxAmount.toLocaleString("es-CO")}</strong> y plazo de{" "}
    <strong>{maxTerm}</strong> meses.
  </>
);
