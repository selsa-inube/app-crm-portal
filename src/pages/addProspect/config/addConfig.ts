export const addConfig = {
  id: 1,
  title: "Simular crédito",
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
      path: "/prospects",
      label: "prospectos",
      id: "/prospectos",
      isActive: false,
    },
    {
      path: `/credit/add-prospect/:customerPublicCode`,
      label: "Simular crédito",
      id: "/credit/add-prospect",
      isActive: true,
    },
  ],
};
export const textAddCongfig = {
  buttonQuotas: "Cupos",
  buttonPaymentCapacity: "Cap. de pago",
  errorPost: "Error al crear la solicitud de crédito",
};
