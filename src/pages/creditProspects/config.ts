export const addConfig = {
  id: 1,
  title: "Prospectos de crédito",
  route: "/credit",
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
  ],
};

export const dataCreditProspects = {
  simulate: "Simular crédito",
  keyWord: "Palabra clave",
};
