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
      path: "/credit/credit-requests",
      label: "Prospectos de crédito",
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
  accept: "Aceptar",
  cancel: "Cancelar",
  sure: "Esta acción te redirigirá a otro portal. ¿Seguro que deseas continuar?",
  creditApplication: "Solicitud de crédito",
};

export const dataError = {
  notCredits:
    "Este cliente aún no tiene ningúna solicitud de crédito en trámite.",
};
