export const applyForCreditConfig = {
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
      path: `/apply-for-credit/:customerPublicCode/:prospectCode`,
      label: "Solicitar crédito",
      id: "/apply-for-credit/",
      isActive: true,
    },
  ],
};
