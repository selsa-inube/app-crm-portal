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
      path: `/credit/simulate-credit/:customerPublicCode`,
      label: "Simular crédito",
      id: "/credit/simulate-credit",
      isActive: true,
    },
  ],
};
export const textAddCongfig = {
  buttonQuotas: "Cupos",
  titleQuotas: "Cupo por línea de crédito",
  descriptionQuotas:
    "No se pueden seleccionar los cupos porque no se han seleccionado las líneas de crédito.",
  close: "Cerrar",
  buttonPaymentCapacity: "Cap. de pago",
  titlePaymentCapacity: "Análisis de capacidad de pago",
  descriptionPaymentCapacity:
    "El sistema no cuenta con información financiera del cliente",
  errorPost: "Error al crear la solicitud de crédito",
};
