export const addConfig = {
  id: 1,
  title: {
    code: "Title",
    description: "Credit prospects title",
    i18n: {
      en: "Simulate credit",
      es: "Simular crédito",
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
      path: `/credit/simulate-credit`,
      label: {
        code: "Simulate_credit_label",
        description: "Simulate credit breadcrumb label",
        i18n: {
          en: "Simulate credit",
          es: "Simular crédito",
        },
      },
      id: "/credit/simulate-credit",
      isActive: false,
    },
  ],
};

export const textAddConfig = {
  buttonQuotas: {
    code: "Button_quotas",
    description: "Button to view quotas",
    i18n: { en: "Quotas", es: "Cupos" },
  },
  buttonPaymentCapacity: {
    code: "Button_paymentCapacity",
    description: "Button to view payment capacity",
    i18n: { en: "Payment capacity", es: "Cap. de pago" },
  },
  errorPost: {
    code: "Error_post",
    description: "Error when creating credit application",
    i18n: {
      en: "Error creating credit application",
      es: "Error al crear la solicitud de crédito",
    },
  },
  mainBorrower: {
    code: "Main_borrower",
    description: "Label for the main borrower",
    i18n: { en: "Main borrower", es: "Deudor principal" },
  },
  financialObligation: {
    code: "Financial_obligation",
    description: "Label for financial obligations",
    i18n: { en: "Financial obligation", es: "Obligaciones financieras" },
  },
};
