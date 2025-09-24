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
  messageTitle: "Observaciones",
  moneyDesination: "Destino del dinero",
  observationProspect: "Observaciones del cliente",
  errorObservations: "Error al actualizar comentario del prospecto",
  confirmTitle: "Confirmación de prospecto",
  confirmDescription: "¿Realmente deseas confirmar este prospecto de crédito?",
  deleteTitle: "Eliminar prospecto",
  deleteDescription: "¿Realmente deseas eliminar este prospecto de crédito?",
  confirm: "Confirmar",
  cancel: "Cancelar",
  errorCreditProspect: "No se han podido cargar los prospectos de credito.",
  errorRemoveProspect: "No se ha podido eliminar el prospecto de crédito.",
  close: "Cerrar",
  modify: "Modificar observaciones",
  preanalysis: "Comentarios del pre-análisis",
};
