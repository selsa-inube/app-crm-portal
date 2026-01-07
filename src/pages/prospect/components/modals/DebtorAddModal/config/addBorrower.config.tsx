export const stepsAddBorrower = {
  generalInformation: {
    id: 1,
    number: 1,
    name: {
      code: "GeneralInformation_name",
      description: "Label for the general information step",
      i18n: { en: "Personal data", es: "Datos Personales" },
    },
    description: {
      code: "GeneralInformation_description",
      description: "Description for the general information step",
      i18n: {
        en: "Borrower's personal information",
        es: "Información del deudor",
      },
    },
  },
  contactInformation: {
    id: 2,
    number: 2,
    name: {
      code: "ContactInformation_name",
      description: "Label for the contact information step",
      i18n: { en: "Income sources", es: "Fuentes de Ingreso" },
    },
    description: {
      code: "ContactInformation_description",
      description: "Description for the contact information step",
      i18n: {
        en: "Borrower's income sources",
        es: "Fuentes de ingreso del deudor",
      },
    },
  },
  BorrowerData: {
    id: 3,
    number: 3,
    name: {
      code: "BorrowerData_name",
      description: "Label for the borrower's financial obligations step",
      i18n: { en: "Financial obligations", es: "Obligaciones Financieras" },
    },
    description: {
      code: "BorrowerData_description",
      description: "Description for the borrower's financial obligations step",
      i18n: {
        en: "Obligations that the borrower needs to pay",
        es: "Obligaciones que tiene que pagar el deudor",
      },
    },
  },
  summary: {
    id: 4,
    number: 4,
    name: {
      code: "Summary_name",
      description: "Label for the summary step",
      i18n: { en: "Verification", es: "Verificación" },
    },
    description: {
      code: "Summary_description",
      description: "Description for the summary step",
      i18n: {
        en: "Verify that the entered data is correct",
        es: "Verifica que los datos ingresados sean correctos.",
      },
    },
  },
};
