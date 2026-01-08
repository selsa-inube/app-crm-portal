export const addConfig = {
  id: 1,
  title: "Prospectos de crédito",
  route: "/credit/prospects",
  crumbs: [
    {
      path: "/home",
      label: "Inicio",
      id: "/home",
      isActive: true,
    },
    {
      path: "/credit",
      label: "Crédito",
      id: "/credito",
      isActive: false,
    },
    {
      path: "/credit/prospects",
      label: "Prospectos de crédito",
      id: "/prospectos",
      isActive: false,
    },
    {
      path: `/credit/simulate-credit`,
      label: "Simular crédito",
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
