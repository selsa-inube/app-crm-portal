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

export const textAddCongfig = {
  buttonQuotas: "Cupos",
  buttonPaymentCapacity: "Cap. de pago",
  errorPost: "Error al crear la solicitud de crédito",
  mainBorrower: "MainBorrower",
  financialObligation: "FinancialObligation",
  requirements: "Requisitos",
};
