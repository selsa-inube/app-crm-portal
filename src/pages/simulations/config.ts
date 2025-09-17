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
      path: `/credit/prospects/prospectCode`,
      label: "Prospectos de crédito",
      id: "/prospectosId",
      isActive: false,
    },
  ],
};

export const dataEditProspect = {
  creditProspect: "Prospecto de crédito",
  destination: "Destino",
  value: "Valor solicitado/giro",
  delete: "Eliminar prospecto",
  confirm: "Confirmar solicitud",
  errorCredit: "Error al obtener las solicitudes de crédito",
  errorProspect: "Error al obtener el prospecto",
  errorRemoveProspect: "No se ha podido eliminar el prospecto de crédito.",
  deleteTitle: "Eliminar prospecto",
  deleteDescription: "¿Realmente deseas eliminar este prospecto de crédito?",
};

export const titlesModal = {
  title: "Información",
  subTitle: "¿Porque está deshabilitado?",
  titlePrivileges:
    "No cuenta con los privilegios necesarios para ejecutar esta acción.",
  titleRequest:
    "Ya existe una solicitud de crédito radicada con el mismo código de prospecto.",
  titleSubmitted: "El prospecto ya se encuentra radicado.",
  textButtonNext: "Entendido",
};
