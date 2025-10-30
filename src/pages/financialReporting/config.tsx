import { MdAddCircleOutline } from "react-icons/md";

import { IOptionButtons } from "@components/modals/ListModal";
import { addItem } from "@mocks/utils/dataMock.service";

type Observer<T> = (data: T) => void;

function observer<T>() {
  const observers: Observer<T>[] = [];

  return {
    subscribe: (observer: Observer<T>) => {
      observers.push(observer);
    },
    unsubscribe: (observer: Observer<T>) => {
      observers.filter((obs) => obs !== observer);
    },
    notify: (data: T) => {
      observers.forEach((observer) => observer(data));
    },
  };
}

export const traceObserver = observer();

export const errorObserver = observer<{
  id: string;
  message: string;
}>();

export const handleConfirmReject = async (
  id: string,
  user: string,
  formData: { textarea: string },
) => {
  const justificationText = formData.textarea;

  if (justificationText && id) {
    const trace = {
      trace_value: "Document uploaded",
      credit_request_id: id,
      use_case: "document_upload",
      user_id: user,
      execution_date: new Date().toISOString(),
      justification: justificationText,
      decision_taken_by_user: "rejected",
      trace_type: "executed_task",
      read_novelty: "",
    };

    try {
      await addItem("trace", trace);
      traceObserver.notify(trace);
    } catch (error) {
      console.error(`No se ha podido realizar el rechazo: ${error}`);
    }
  }
};

export const handleConfirmCancel = async (
  id: string,
  user: string,
  formData: { textarea: string },
) => {
  const justificationText = formData.textarea;

  if (justificationText && id) {
    const trace = {
      trace_value: "Document cancelled",
      credit_request_id: id,
      use_case: "document_cancel",
      user_id: user,
      execution_date: new Date().toISOString(),
      justification: justificationText,
      decision_taken_by_user: "cancelled",
      trace_type: "executed_task",
      read_novelty: "",
    };

    try {
      await addItem("trace", trace);
      traceObserver.notify(trace);
    } catch (error) {
      console.error(`No se ha podido realizar la anulación: ${error}`);
    }
  }
};

export const optionButtons: IOptionButtons = {
  label: "Adjuntar archivo",
  variant: "none",
  icon: <MdAddCircleOutline />,
  fullwidth: false,
  onClick: () => {},
};

type ConfigHandleactions = {
  buttonPrint: () => void;
  buttonViewAttachments: () => void;
  buttonWarranty: () => void;
  menuIcon: () => void;
};

export const configHandleactions = ({
  buttonPrint = () => {},
  buttonViewAttachments = () => {},
  buttonWarranty = () => {},
  menuIcon = () => {},
}: ConfigHandleactions) => {
  return {
    buttons: {
      buttonPrint: {
        OnClick: buttonPrint,
      },
    },
    buttonsOutlined: {
      buttonViewAttachments: {
        OnClick: buttonViewAttachments,
      },
      buttonWarranty: {
        OnClick: buttonWarranty,
      },
    },
    menuIcon: menuIcon,
  };
};

export const optionFlags = {
  title: "Adjuntar archivo",
  description: "Los archivos adjuntos fueron cargados correctamente",
  appearance: "success",
  appearanceError: "danger",
};

export const errorMessages = {
  comercialManagement: {
    titleCard: "Estado",
    descriptionCard: "Gestión Comercial",
    title: "No se encontró la solicitud de crédito",
    description:
      "No hay datos relacionados a la solicitud de crédito seleccionada.",
    button: "Volver a buscar",
  },
  toDo: {
    titleCard: "Por hacer",
    title: "No se encontraron tareas",
    description: "No hay tareas disponibles para mostrar en este momento.",
    button: "Volver a intentar",
  },
  approval: {
    titleCard: "Aprobaciones",
    title: "No se encontraron aprobaciones",
    description:
      "No se encontraron datos relacionados con la aprobación del crédito.",
    button: "Volver a intentar",
  },
  Requirements: {
    titleCard: "Requisitos",
    title: "No se encontraron requisitos",
    description: "No hay requisitos disponibles para esta solicitud.",
    button: "Volver a intentar",
  },
  Management: {
    titleCard: "Gestión",
    title: "No se encontró gestión",
    description: "No se ha registrado gestión para esta solicitud.",
    button: "Volver a intentar",
  },
  PromissoryNotes: {
    titleCard: "Pagarés y Libranzas",
    title: "No se encontraron documentos de obligación",
    description:
      "No hay documentos disponibles relacionados con pagarés o libranzas.",
    button: "Volver a intentar",
  },
  Postingvouchers: {
    titleCard: "Comprobantes de Contabilización",
    title: "No se encontraron comprobantes",
    description: "No hay comprobantes contables asociados a esta solicitud.",
    button: "Volver a intentar",
  },
  share: {
    titleCard: "Compartir",
    title: "No se encontraron documentos",
    description: "Error al generar el documento para compartir.",
    button: "Volver a intentar",
    spinner: "Generando PDF...",
  },
  getData: {
    title: "Error al cargar los datos",
    description:
      "Hubo un problema al cargar los datos. Por favor, inténtelo de nuevo más tarde.",
    button: "Volver a intentar",
  },
  errorCreditRequest: "Error al obtener la solicitud de crédito",
};

export const labelsAndValuesShare = {
  titleOnPdf: "Gestión Comercial",
  fileName: "reporte_comercial.pdf",
  text: "Reporte Comercial para compartir",
};
