import { MdOutlineModeEditOutline } from "react-icons/md";

export const infoIcon = {
  icon: <MdOutlineModeEditOutline />,
  onClick: () => console.log("info"),
};

export const staffConfig = {
  title: "Gestor Comercial y Analista",
  confirm: "Aceptar",
  meets: "Cumple el requisito",
  doesNotComply: "No cumple el requisito",
  observations: "Observaciones",
  observationdetails:
    "Proporcione detalles acerca de la evaluación del requisito",
  closeBtn: "Cerrar",
  Cancel: "Cancelar",

  maxLength: 120,
};

export const errorMessagge =
  "Ups, algo salió mal. No se puede cargar la información. Intente nuevamente más tarde.";

export interface FlagMessage {
  title: string;
  description: string;
  appearance: "success" | "danger";
}

export const flagMessages: Record<string, FlagMessage> = {
  changeSuccess: {
    title: "Cambio realizado",
    description: "El cambio se realizó con éxito.",
    appearance: "success",
  },
};

export const buttonText = "Enviar";

export const txtLabels = {
  title: "Confirmar la decisión",
  buttonText: "Enviar",
  secondaryButtonText: "Cancelar",
  inputLabel: "Justificación",
  inputPlaceholder: "Describe el motivo de su decisión.",
};

export const txtFlags = {
  titleSuccess: "¡Proceso exitoso!",
  descriptionSuccess: `La tarea se ha ejecutado de manera correcta. Nueva tarea asignada.`,

  titleWarning: "Error al registrar la decisión",
  descriptionWarning: `Hubo un problema con el proceso. Código: `,

  titleDanger: "Error inesperado",
  descriptionDanger:
    "Ocurrió un error al registrar la tarea. Intente nuevamente más tarde.",

  duration: 5000,
};

export const txtOthersOptions = {
  optionClose: "Cerrar",
  txtDecision: "Decisión",
  txtNoSelect: "No se seleccionó una decisión disponible.",
};
export const soporteInvalidOptions = [
  {
    id: "1",
    label: "Firma de pagares",
    value: "Payroll_discount_authorization",
  },
  { id: "2", label: "Firma de libranza", value: "Promissory_note" },
  { id: "3", label: "Gestión de garantías.", value: "Warranties" },
];

export const txtTaskQuery = {
  txtCommercialManager: "Gestor Comercial",
  txtAnalyst: "Analista",
};

export const titlesModal = {
  title: "Información",
  subTitle: "¿Porque está deshabilitado?",
  description:
    "No cuentas con los privilegios necesarios para ejecutar esta acción.",
  textButtonNext: "Entendido",
};
