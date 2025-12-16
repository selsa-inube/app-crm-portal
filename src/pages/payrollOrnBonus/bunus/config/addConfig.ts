export const addConfig = {
  id: 1,
  title: "Adelanto de prima ",
  subtitle: "Es un adelanto prima de servicios, que se paga cada 6 meses.",
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
      path: "/credit/bonus",
      label: "Adelanto",
      id: "/prospectos",
      isActive: false,
    },
  ],
};

export const textAddConfig = {
  buttonQuotas: "Cupos",
  buttonPaymentCapacity: "Cap. de pago",
  errorPost: "Error al crear la solicitud de crédito",
  mainBorrower: "MainBorrower",
  financialObligation: "FinancialObligation",
  buttonAddLink: "Agregar vinculación",
  buttonPrevious: "Anterior",
  submitRequestTitle: "Enviar solicitud",
  submitRequestQuestion:
    "¿Realmente deseas enviar la solicitud de adelanto de nómina o prima?",
  submitRequestCancel: "Cancelar",
  submitRequestConfirm: "Enviar",
  successModalTitle: "Solicitud ",
  successModalButton: "Entendido",
};

export const disbursemenTabs = {
  internal: {
    id: "Internal_account",
    disabled: false,
    label: "Cuenta interna",
  },
  external: {
    id: "External_account",
    disabled: false,
    label: "Cuenta externa",
  },
  check: { id: "Certified_check", disabled: false, label: "Cheque entidad" },
  management: {
    id: "Business_check",
    disabled: false,
    label: "Cheque de gerencia",
  },
  cash: { id: "Cash", disabled: false, label: "Dinero en efectivo" },
};

export const tittleOptions = {
  title: "Información",
  textButtonNext: "Entendido",
  titleError: "¡Uy, algo ha salido mal!",
  descriptionError: "No se han podido guardar los cambios.",
  errorSubmit: "El radicado no se ha podido enviar correctamente.",
  tryLater: "Estamos tienendo problemas, intentalo mas tarde.",
};

export const prospectStates = {
  CREATED: "Created",
};

export const dataSubmitApplication = {
  modals: {
    fileDescription: "Solicitud ",
    code: "#45678822",
    descriptionSolid:
      "Este proceso será gestionado por uno de nuestros funcionarios, puede tardar algún tiempo mientras se gestiona la aprobación.",
  },
};
