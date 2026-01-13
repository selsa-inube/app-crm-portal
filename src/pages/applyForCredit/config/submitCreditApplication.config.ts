export const submitCreditApplicationConfig = {
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
      path: `/apply-for-credit/:customerPublicCode/:prospectCode`,
      label: {
        code: "Apply_for_credit_label",
        description: "Apply for credit breadcrumb label",
        i18n: {
          en: "Apply for credit",
          es: "Solicitar crédito",
        },
      },
      id: "/apply-for-credit/",
      isActive: false,
    },
  ],
};
