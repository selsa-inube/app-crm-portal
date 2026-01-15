export const stepsAddProspect = {
  generalInformation: {
    id: 1,
    number: 1,
    name: {
      code: "General_information_name",
      description: "Requirements not met step name",
      i18n: { en: "Unmet requirements", es: "Requisitos no cumplidos" },
    },
    description: {
      code: "General_information_description",
      description: "Requirements not met step description",
      i18n: {
        en: "Aspects that are an impediment and must change.",
        es: "Aspectos que son un impedimento y deben cambiar.",
      },
    },
  },
  destination: {
    id: 2,
    number: 2,
    name: {
      code: "Destination_name",
      description: "Money destination step name",
      i18n: { en: "Money destination", es: "Destino del dinero" },
    },
    description: {
      code: "Destination_description",
      description: "Money destination step description",
      i18n: {
        en: "Select the destination of the money.",
        es: "Selecciona el destino del dinero.",
      },
    },
  },
  productSelection: {
    id: 3,
    number: 3,
    name: {
      code: "Product_selection_name",
      description: "Product choice step name",
      i18n: { en: "Product choice", es: "Elección del producto" },
    },
    description: {
      code: "Product_selection_description",
      description: "Product choice step description",
      i18n: {
        en: "Select the credit products.",
        es: "Selecciona los productos de crédito.",
      },
    },
  },
  extraordinaryInstallments: {
    id: 4,
    number: 4,
    name: {
      code: "Extraordinary_installments_name",
      description: "Special payments step name",
      i18n: { en: "Special payments", es: "Abonos especiales" },
    },
    description: {
      code: "Extraordinary_installments_description",
      description: "Special payments step description",
      i18n: {
        en: "Schedule payments to decrease the ordinary payment or shorten the term.",
        es: "Programa abonos para disminuir el pago ordinario o recortar plazo.",
      },
    },
  },
  sourcesIncome: {
    id: 5,
    number: 5,
    name: {
      code: "Sources_income_name",
      description: "Income sources step name",
      i18n: { en: "Income sources", es: "Fuentes de ingreso" },
    },
    description: {
      code: "Sources_income_description",
      description: "Income sources step description",
      i18n: {
        en: "Update income sources to support payment capacity.",
        es: "Actualiza las fuentes de ingreso para soportar capacidad de pago.",
      },
    },
  },
  riskScore: {
    id: 6,
    number: 6,
    name: {
      code: "Risk_score_name",
      description: "Risk score step name",
      i18n: { en: "Risk score", es: "Score de riesgo" },
    },
    description: {
      code: "Risk_score_description",
      description: "Risk score step description",
      i18n: {
        en: "Verify the risk score and update it if necessary.",
        es: "Verifica el score de riesgo y actualízalo de ser necesario.",
      },
    },
  },
  obligationsFinancial: {
    id: 7,
    number: 7,
    name: {
      code: "Obligations_financial_name",
      description: "Financial obligations step name",
      i18n: { en: "Financial obligations", es: "Obligaciones financieras" },
    },
    description: {
      code: "Obligations_financial_description",
      description: "Financial obligations step description",
      i18n: {
        en: "Verify the reported financial obligations.",
        es: "Verifica las obligaciones financieras reportadas.",
      },
    },
  },
  extraBorrowers: {
    id: 8,
    number: 8,
    name: {
      code: "Extra_borrowers_name",
      description: "Borrowers step name",
      i18n: { en: "Borrowers", es: "Deudores" },
    },
    description: {
      code: "Extra_borrowers_description",
      description: "Borrowers step description",
      i18n: { en: "Register the borrowers.", es: "Registra los deudores." },
    },
  },
  loanConditions: {
    id: 9,
    number: 9,
    name: {
      code: "Loan_conditions_name",
      description: "Application restrictions step name",
      i18n: {
        en: "Application restrictions",
        es: "Restricciones de la solicitud",
      },
    },
    description: {
      code: "Loan_conditions_description",
      description: "Application restrictions step description",
      i18n: {
        en: "Register if the client has restrictions on the ordinary installment value or the payment term.",
        es: "Registra si el cliente tiene restricciones en el valor de la cuota ordinaria o en el plazo para el pago.",
      },
    },
  },
  loanAmount: {
    id: 10,
    number: 10,
    name: {
      code: "Loan_amount_name",
      description: "Application value step name",
      i18n: { en: "Application value", es: "Valor de la solicitud" },
    },
    description: {
      code: "Loan_amount_description",
      description: "Application value step description",
      i18n: {
        en: "Register the application value and the payment channel.",
        es: "Registra el valor de la solicitud y el medio de pago.",
      },
    },
  },
  obligationsCollected: {
    id: 11,
    number: 11,
    name: {
      code: "Obligations_collected_name",
      description: "Collected obligations step name",
      i18n: { en: "Collected obligations", es: "Obligaciones recogidas" },
    },
    description: {
      code: "Obligations_collected_description",
      description: "Collected obligations step description",
      i18n: {
        en: "Select the financial obligations that will be collected.",
        es: "Selecciona las obligaciones financieras que serán recogidas.",
      },
    },
  },
};
