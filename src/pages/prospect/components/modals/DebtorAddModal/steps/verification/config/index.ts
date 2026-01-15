export const verificationDebtorAddModalConfig = {
  personalInfo: {
    title: {
      code: "VerificationDebtorAddModal_personalInfo_title",
      description: "Title for personal information section",
      i18n: { en: "Personal information", es: "Información personal" },
    },
    fields: {
      documentType: {
        code: "VerificationDebtorAddModal_documentType",
        description: "Label for document type field",
        i18n: { en: "Document type", es: "Tipo de documento" },
      },
      documentNumber: {
        code: "VerificationDebtorAddModal_documentNumber",
        description: "Label for document number field",
        i18n: { en: "Document number", es: "Número de documento" },
      },
      firstName: {
        code: "VerificationDebtorAddModal_firstName",
        description: "Label for first name field",
        i18n: { en: "First name", es: "Primer nombre" },
      },
      lastName: {
        code: "VerificationDebtorAddModal_lastName",
        description: "Label for last name field",
        i18n: { en: "Last name", es: "Segundo nombre" },
      },
      email: {
        code: "VerificationDebtorAddModal_email",
        description: "Label for email field",
        i18n: { en: "Email", es: "Correo electrónico" },
      },
      phone: {
        code: "VerificationDebtorAddModal_phone",
        description: "Label for phone number field",
        i18n: { en: "Phone number", es: "Número de teléfono" },
      },
      biologicalSex: {
        code: "VerificationDebtorAddModal_biologicalSex",
        description: "Label for biological sex field",
        i18n: { en: "Biological sex", es: "Sexo biológico" },
      },
      age: {
        code: "VerificationDebtorAddModal_age",
        description: "Label for age field",
        i18n: { en: "Age", es: "Edad" },
      },
      relationship: {
        code: "VerificationDebtorAddModal_relationship",
        description: "Label for relationship field",
        i18n: { en: "Relationship", es: "Parentesco" },
      },
    },
  },
  incomeInfo: {
    title: {
      code: "VerificationDebtorAddModal_incomeInfo_title",
      description: "Title for income information section",
      i18n: { en: "Income sources", es: "Fuentes de ingreso" },
    },
    fields: {
      totalEmploymentIncome: {
        code: "VerificationDebtorAddModal_totalEmploymentIncome",
        description: "Label for employment income field",
        i18n: { en: "Employment income", es: "Rentas de trabajo" },
      },
      totalCapitalIncome: {
        code: "VerificationDebtorAddModal_totalCapitalIncome",
        description: "Label for capital income field",
        i18n: { en: "Capital income", es: "Rentas de capital" },
      },
      totalBusinessIncome: {
        code: "VerificationDebtorAddModal_totalBusinessIncome",
        description: "Label for other variable income field",
        i18n: { en: "Other variable income", es: "Otros ingresos variables" },
      },
    },
  },
  financialObligations: {
    title: {
      code: "VerificationDebtorAddModal_financialObligations_title",
      description: "Title for financial obligations section",
      i18n: { en: "Financial obligations", es: "Obligaciones financieras" },
    },
  },
  stepNumbers: {
    personalInfo: 1,
    incomeInfo: 2,
    financialObligations: 3,
  },
  back: {
    code: "VerificationDebtorAddModal_back",
    description: "Text for going back to previous step",
    i18n: { en: "Back to this step", es: "Regresar a este paso" },
  },
};
