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
      path: "/credit/simulations",
      label: "Prospectos de crédito",
      id: "/prospectos",
      isActive: false,
    },
    {
      path: `/apply-for-credit/:customerPublicCode/:prospectCode`,
      label: "Solicitar crédito",
      id: "/apply-for-credit/",
      isActive: true,
    },
  ],
};
