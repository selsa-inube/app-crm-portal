export const submitCreditApplicationConfig = {
  id: 1,
  title: "Solicitar crédito",
  route: "/edit-prospect/:prospectCode",
  crumbs: [
    {
      path: "/",
      label: "Inicio",
      id: "/home",
      isActive: true,
    },
    {
      path: "/credit",
      label: "credito",
      id: "/credito",
      isActive: false,
    },
    {
      path: "/prospects",
      label: "prospectos",
      id: "/prospectos",
      isActive: false,
    },
    {
      path: `/submit-credit-application/:customerPublicCode/:prospectCode`,
      label: "Solicitar crédito",
      id: "/submit-credit-application/",
      isActive: true,
    },
  ],
};
