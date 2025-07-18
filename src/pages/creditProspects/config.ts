export const addConfig = {
  id: 1,
  title: "Prospectos aaade crédito",
  route: "/credit",
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
  ],
};

export const dataCreditProspects = {
  simulate: "Simular crédito",
  keyWord: "Palabra clave",
};
