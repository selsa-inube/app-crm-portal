export const frcConfig = {
  title: {
    code: "Frc_title",
    description: "FRC maximum indebtedness title",
    i18n: {
      en: "Maximum indebtedness by FRC",
      es: "Endeudamiento máximo x FRC",
    },
  },
  subTitle: {
    code: "Frc_subtitle",
    description: "Risk score",
    i18n: {
      en: "Risk score",
      es: "Score de riesgo",
    },
  },
  totalScoreLabel: {
    code: "Total_score_label",
    description: "Total score",
    i18n: {
      en: "Total score",
      es: "Puntaje total",
    },
  },
  totalScoreMax: {
    code: "Total_score_max",
    description: "Total score max",
    i18n: {
      en: "/1000",
      es: "/1000",
    },
  },
  seniorityLabel: {
    code: "Seniority_label",
    description: "Seniority",
    i18n: {
      en: "Seniority",
      es: "Antigüedad",
    },
  },
  seniorityMax: {
    code: "Seniority_max",
    description: "Seniority max",
    i18n: {
      en: "/200",
      es: "/200",
    },
  },
  centralRiskLabel: {
    code: "Central_risk_label",
    description: "Credit bureau",
    i18n: {
      en: "Credit bureau",
      es: "Central de riesgo",
    },
  },
  centralRiskMax: {
    code: "Central_risk_max",
    description: "Central risk max",
    i18n: {
      en: "/200",
      es: "/200",
    },
  },
  employmentStabilityLabel: {
    code: "Employment_stability_label",
    description: "Employment stability index",
    i18n: {
      en: "Employment stability index",
      es: "Índice de estabilidad laboral",
    },
  },
  employmentStabilityMax: {
    code: "Employment_stability_max",
    description: "Employment stability max",
    i18n: {
      en: "/300",
      es: "/300",
    },
  },
  maritalStatusLabel: {
    code: "Marital_status_label",
    description: "Marital status - Married",
    i18n: {
      en: "Marital status - Married",
      es: "Estado civil - Casado",
    },
  },
  maritalStatusMax: {
    code: "Marital_status_max",
    description: "Marital status max",
    i18n: {
      en: "/50",
      es: "/50",
    },
  },
  economicActivityLabel: {
    code: "Economic_activity_label",
    description: "Economic activity - Retired",
    i18n: {
      en: "Economic activity - Retired",
      es: "Actividad económica - Pensionado",
    },
  },
  economicActivityMax: {
    code: "Economic_activity_max",
    description: "Economic activity max",
    i18n: {
      en: "/200",
      es: "/200",
    },
  },
  incomesLabel: {
    code: "Monthly_income_label",
    description: "Monthly income",
    i18n: {
      en: "(+) Monthly income",
      es: "(+) Ingresos mensuales",
    },
  },
  timesIncome: {
    code: "Income_multiplier_label",
    description: "Income multiplier",
    i18n: {
      en: "(x) Income multiplier for this score",
      es: "(x) No. de veces el ingreso para este score",
    },
  },
  maxIndebtedness: {
    code: "Max_indebtedness_label",
    description: "Maximum indebtedness",
    i18n: {
      en: "Maximum indebtedness",
      es: "Endeudamiento máximo",
    },
  },
  closeBtn: {
    code: "Close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  loading: {
    code: "Loading",
    description: "Loading",
    i18n: {
      en: "Loading...",
      es: "Cargando...",
    },
  },
  intercept: {
    code: "Intercept_label",
    description: "Intercept",
    i18n: {
      en: "Intercept",
      es: "Intercepto",
    },
  },
  maxLimit: {
    code: "Max_limit_label",
    description: "Maximum limit",
    i18n: {
      en: "(=) Maximum limit",
      es: "(=) Tope máximo",
    },
  },
  totalPortafolio: {
    code: "Total_portfolio_label",
    description: "Total current portfolio",
    i18n: {
      en: "(-) Current total portfolio",
      es: "(-) Cartera total vigente",
    },
  },
  scoreLabel: {
    code: "Score_value",
    description: "Score value",
    i18n: {
      en: "749",
      es: "749",
    },
  },
  loremIpsum: {
    code: "Lorem_ipsum",
    description: "Informational text",
    i18n: {
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      es: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
  },

  infoTexts: {
    intercept: {
      code: "Info_intercept",
      description: "Intercept info",
      i18n: {
        en: "The intercept is the base value of the credit risk analysis. It represents the starting point of the score.",
        es: "El intercepto es el valor base inicial del análisis de riesgo crediticio. Representa el punto de partida del score antes de aplicar otras variables.",
      },
    },
    seniority: {
      code: "Info_seniority",
      description: "Seniority info",
      i18n: {
        en: "Seniority evaluates the length of the customer's relationship with the entity.",
        es: "La antigüedad evalúa el tiempo de relación del cliente con la entidad. Mayor antigüedad generalmente indica mayor estabilidad y confianza.",
      },
    },
    centralRisk: {
      code: "Info_central_risk",
      description: "Central risk info",
      i18n: {
        en: "The credit bureau checks the customer's credit history in the financial system.",
        es: "La central de riesgo verifica el historial crediticio del cliente en el sistema financiero. Un buen comportamiento mejora el puntaje.",
      },
    },
    employmentStability: {
      code: "Info_employment_stability",
      description: "Employment stability info",
      i18n: {
        en: "This index measures the customer's job stability.",
        es: "Este índice mide la estabilidad laboral del cliente. Considera tiempo en el empleo actual y tipo de vinculación laboral.",
      },
    },
    maritalStatus: {
      code: "Info_marital_status",
      description: "Marital status info",
      i18n: {
        en: "Marital status may influence payment capacity.",
        es: "El estado civil puede influir en la capacidad de pago. Algunos estados civiles se consideran de mayor estabilidad financiera.",
      },
    },
    economicActivity: {
      code: "Info_economic_activity",
      description: "Economic activity info",
      i18n: {
        en: "Economic activity classifies the source of income.",
        es: "La actividad económica clasifica la fuente de ingresos. Diferentes actividades tienen distintos niveles de riesgo asociados.",
      },
    },
  },

  error: {
    title: {
      code: "Error_title",
      description: "Error title",
      i18n: {
        en: "Error loading data",
        es: "Error cargando datos",
      },
    },
    message: {
      code: "Error_message",
      description: "Error message",
      i18n: {
        en: "The data could not be loaded. Please try again later.",
        es: "No se pudieron cargar los datos. Por favor, intente nuevamente más tarde.",
      },
    },
  },
};

export type InfoModalType =
  | "intercept"
  | "seniority"
  | "centralRisk"
  | "employmentStability"
  | "maritalStatus"
  | "economicActivity";
