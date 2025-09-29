export const addConfig = {
  id: 1,
  title: "Solicitudes de crédito",
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
      path: "/credit/credit-requests",
      label: "Solicitudes de crédito",
      id: "/prospectos",
      isActive: false,
    },
  ],
};

export const dataCreditProspects = {
  applyCredit: "Solicitar crédito",
  keyWord: "Palabra clave",
  errorCreditRequest: "No se han podido cargar las solicitudes de credito.",
  titleError: "Lamentamos los inconvenientes",
};

export const dataError = {
  notCredits:
    "Este cliente aún no tiene ningúna solicitud de crédito en trámite.",
};
