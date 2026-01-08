export const addConfig = {
  id: 1,
  title: "Adelanto de nómina",
  subtitle: "Es un adelanto de tu salario o nómina mensual.",
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
      path: "/credit/payroll-advance-credit",
      label: "Crédito por adelanto de nómina",
      id: "/prospectos",
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
  buttonPrevious: "Anterior",
  buttonAddLink: "Agregar vinculación",
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
    submit: {
      title: "Enviar solicitud",
      confirmationText:
        "¿Realmente deseas enviar la solicitud de adelanto de nómina o prima?",
      cancelButton: "Cancelar",
      sendButton: "Enviar",
    },
    return: {
      title: "Regresar",
      confirmationText:
        "¿Realmente quieres regresar? Se perderá el avance de tu solicitud.",
      cancelButton: "Cancelar",
      sendButton: "Sí, regresar",
    },
    success: {
      title: "Solicitud ",
      fileDescription: "Solicitud ",
      code: "#45678822",
      descriptionSolid:
        "Este proceso será gestionado por uno de nuestros funcionarios, puede tardar algún tiempo mientras se gestiona la aprobación.",
      buttonText: "Entendido",
    },
    showExceedQuotaModal: {
      title: "Acción no permitida",
      nextButton: "Entendido",
      description:
        "La Unidad de negocio no permite solicitar un monto mayor al cupo disponible, prueba con un valor menor o igual a Cupo disponible",
    },
  },
};
