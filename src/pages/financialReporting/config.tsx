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

export const errorMessages = {
  comercialManagement: {
    titleCard: {
      code: "Error_CM_titleCard",
      description: "Commercial management card title",
      i18n: {
        en: "Status",
        es: "Estado",
      },
    },
    descriptionCard: {
      code: "Error_CM_descriptionCard",
      description: "Commercial management card description",
      i18n: {
        en: "Commercial Management",
        es: "Gestión Comercial",
      },
    },
    title: {
      code: "Error_CM_title",
      description: "Credit request not found title",
      i18n: {
        en: "Credit request not found",
        es: "No se encontró la solicitud de crédito",
      },
    },
    description: {
      code: "Error_CM_description",
      description: "Credit request not found description",
      i18n: {
        en: "No data related to the selected credit request.",
        es: "No hay datos relacionados a la solicitud de crédito seleccionada.",
      },
    },
    button: {
      code: "Error_CM_button",
      description: "Back to search button",
      i18n: {
        en: "Search again",
        es: "Volver a buscar",
      },
    },
  },

  toDo: {
    titleCard: {
      code: "Error_ToDo_titleCard",
      description: "To do card title",
      i18n: {
        en: "To do",
        es: "Por hacer",
      },
    },
    title: {
      code: "Error_ToDo_title",
      description: "No tasks found title",
      i18n: {
        en: "No tasks found",
        es: "No se encontraron tareas",
      },
    },
    description: {
      code: "Error_ToDo_description",
      description: "No tasks available description",
      i18n: {
        en: "There are no tasks to display at the moment.",
        es: "No hay tareas disponibles para mostrar en este momento.",
      },
    },
    button: {
      code: "Error_ToDo_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  approval: {
    titleCard: {
      code: "Error_Approval_titleCard",
      description: "Approvals card title",
      i18n: {
        en: "Approvals",
        es: "Aprobaciones",
      },
    },
    title: {
      code: "Error_Approval_title",
      description: "No approvals found title",
      i18n: {
        en: "No approvals found",
        es: "No se encontraron aprobaciones",
      },
    },
    description: {
      code: "Error_Approval_description",
      description: "No approval data description",
      i18n: {
        en: "No data related to credit approval was found.",
        es: "No se encontraron datos relacionados con la aprobación del crédito.",
      },
    },
    button: {
      code: "Error_Approval_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  Requirements: {
    titleCard: {
      code: "Error_Requirements_titleCard",
      description: "Requirements card title",
      i18n: {
        en: "Requirements",
        es: "Requisitos",
      },
    },
    title: {
      code: "Error_Requirements_title",
      description: "No requirements found title",
      i18n: {
        en: "No requirements found",
        es: "No se encontraron requisitos",
      },
    },
    description: {
      code: "Error_Requirements_description",
      description: "No requirements description",
      i18n: {
        en: "There are no requirements for this request.",
        es: "No hay requisitos disponibles para esta solicitud.",
      },
    },
    button: {
      code: "Error_Requirements_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  Management: {
    titleCard: {
      code: "Error_Management_titleCard",
      description: "Management card title",
      i18n: {
        en: "Management",
        es: "Gestión",
      },
    },
    title: {
      code: "Error_Management_title",
      description: "No management found title",
      i18n: {
        en: "No management found",
        es: "No se encontró gestión",
      },
    },
    description: {
      code: "Error_Management_description",
      description: "No management description",
      i18n: {
        en: "No management has been registered for this request.",
        es: "No se ha registrado gestión para esta solicitud.",
      },
    },
    button: {
      code: "Error_Management_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  PromissoryNotes: {
    titleCard: {
      code: "Error_PromissoryNotes_titleCard",
      description: "Promissory notes card title",
      i18n: {
        en: "Promissory notes and payroll deductions",
        es: "Pagarés y Libranzas",
      },
    },
    title: {
      code: "Error_PromissoryNotes_title",
      description: "No obligation documents found title",
      i18n: {
        en: "No obligation documents found",
        es: "No se encontraron documentos de obligación",
      },
    },
    description: {
      code: "Error_PromissoryNotes_description",
      description: "No obligation documents description",
      i18n: {
        en: "There are no related documents available.",
        es: "No hay documentos disponibles relacionados.",
      },
    },
    button: {
      code: "Error_PromissoryNotes_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  Postingvouchers: {
    titleCard: {
      code: "Error_Postingvouchers_titleCard",
      description: "Posting vouchers card title",
      i18n: {
        en: "Posting vouchers",
        es: "Comprobantes de Contabilización",
      },
    },
    title: {
      code: "Error_Postingvouchers_title",
      description: "No posting vouchers found title",
      i18n: {
        en: "No vouchers found",
        es: "No se encontraron comprobantes",
      },
    },
    description: {
      code: "Error_Postingvouchers_description",
      description: "No posting vouchers description",
      i18n: {
        en: "There are no accounting vouchers associated with this request.",
        es: "No hay comprobantes contables asociados a esta solicitud.",
      },
    },
    button: {
      code: "Error_Postingvouchers_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  share: {
    titleCard: {
      code: "Error_Share_titleCard",
      description: "Share card title",
      i18n: {
        en: "Share",
        es: "Compartir",
      },
    },
    title: {
      code: "Error_Share_title",
      description: "No documents found title",
      i18n: {
        en: "No documents found",
        es: "No se encontraron documentos",
      },
    },
    description: {
      code: "Error_Share_description",
      description: "Share document error description",
      i18n: {
        en: "Error generating the document to share.",
        es: "Error al generar el documento para compartir.",
      },
    },
    button: {
      code: "Error_Share_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
    spinner: {
      code: "Error_Share_spinner",
      description: "Generating PDF spinner text",
      i18n: {
        en: "Generating PDF...",
        es: "Generando PDF...",
      },
    },
  },

  getData: {
    title: {
      code: "Error_GetData_title",
      description: "Load data error title",
      i18n: {
        en: "Error loading data",
        es: "Error al cargar los datos",
      },
    },
    description: {
      code: "Error_GetData_description",
      description: "Load data error description",
      i18n: {
        en: "There was a problem loading the data. Please try again later.",
        es: "Hubo un problema al cargar los datos. Por favor, inténtelo de nuevo más tarde.",
      },
    },
    button: {
      code: "Error_GetData_button",
      description: "Retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },

  errorCreditRequest: {
    code: "Error_CreditRequest",
    description: "Credit request fetch error",
    i18n: {
      en: "Error fetching credit request",
      es: "Error al obtener la solicitud de crédito",
    },
  },

  prospect: {
    code: "Error_Prospect",
    description: "Prospect load error",
    i18n: {
      en: "We couldn't load prospect data.",
      es: "No pudimos cargar los datos del prospecto.",
    },
  },

  documents: {
    code: "Error_Documents",
    description: "Documents load error",
    i18n: {
      en: "We couldn't display attached documents.",
      es: "No pudimos mostrar los documentos adjuntos.",
    },
  },

  errorRemoveProspect: {
    code: "Error_RemoveProspect",
    description: "Remove prospect error",
    i18n: {
      en: "The credit prospect could not be removed.",
      es: "No se ha podido eliminar el prospecto de crédito.",
    },
  },

  noBusinessUnit: {
    code: "Error_NoBusinessUnit",
    description: "No business unit found error",
    i18n: {
      en: "There is no business unit associated with the portal code.",
      es: "No hay una unidad de negocio relacionada con el código del portal.",
    },
  },

  noSelectClient: {
    code: "Error_NoSelectClient",
    description: "No client selected error",
    i18n: {
      en: "No client has been selected.",
      es: "No se ha seleccionado ningún cliente.",
    },
  },
};

export const labelsAndValuesShare = {
  titleOnPdf: {
    code: "Share_titleOnPdf",
    description: "PDF title",
    i18n: {
      en: "Commercial Management",
      es: "Gestión Comercial",
    },
  },
  fileName: {
    code: "Share_fileName",
    description: "PDF file name",
    i18n: {
      en: "commercial_report.pdf",
      es: "reporte_comercial.pdf",
    },
  },
  text: {
    code: "Share_text",
    description: "Share report text",
    i18n: {
      en: "Commercial report to share",
      es: "Reporte Comercial para compartir",
    },
  },
  addLink: {
    code: "Share_addLink",
    description: "Add link action",
    i18n: {
      en: "Add link",
      es: "Agregar vinculación",
    },
  },
  changePortal: {
    code: "Share_changePortal",
    description: "Change portal warning message",
    i18n: {
      en: "The credit request has not been processed. Are you sure you want to continue to another portal?",
      es: "La solicitud de crédito no esta tramitada. ¿Seguro que deseas continuar a otro portal?",
    },
  },
};
export const financialReportingLabelsEnum = {
  attachments: {
    titleList: {
      code: "FinancialReporting_attachments_titleList",
      description: "Title for the attach documents modal",
      i18n: { en: "Attach", es: "Adjuntos" },
    },
    errorModal: {
      code: " FinancialReporting_attachments_errorModal",
      description: "Error message for the attach documents modal",
      i18n: {
        en: "There are no attachments available for this request",
        es: "No hay archivos adjuntos disponibles para esta solicitud",
      },
    },
    titleView: {
      code: "FinancialReporting_attachments_titleView",
      description: "Title for viewing attached documents",
      i18n: { en: "View Attachments", es: "Ver Adjuntos" },
    },
    saveButton: {
      code: "FinancialReporting_attachments_saveButton",
      description: "Label for save button in attachments",
      i18n: { en: "Save", es: "Guardar" },
    },
    closeButton: {
      code: "FinancialReporting_attachments_closeButton",
      description: "Label for close button in attachments",
      i18n: { en: "Close", es: "Cerrar" },
    },
  },
  rejectModal: {
    title: {
      code: "FinancialReporting_reject_title",
      description: "Title for the rejection modal",
      i18n: { en: "Reject", es: "Rechazar" },
    },
    button: {
      code: "FinancialReporting_reject_button",
      description: "Confirm button for rejection",
      i18n: { en: "Confirm", es: "Confirmar" },
    },
    label: {
      code: "FinancialReporting_reject_label",
      description: "Input label for rejection reason",
      i18n: { en: "Reason for rejection", es: "Motivo del Rechazo." },
    },
    placeholder: {
      code: "FinancialReporting_reject_placeholder",
      description: "Input placeholder for rejection reason",
      i18n: {
        en: "Describe the reason for rejection.",
        es: "Describe el motivo del Rechazo.",
      },
    },
  },
  cancelModal: {
    title: {
      code: "FinancialReporting_cancel_title",
      description: "Title for the annulment modal",
      i18n: { en: "Annul", es: "Anular" },
    },
    button: {
      code: "FinancialReporting_cancel_button",
      description: "Confirm button for annulment",
      i18n: { en: "Confirm", es: "Confirmar" },
    },
    label: {
      code: "FinancialReporting_cancel_label",
      description: "Input label for annulment reason",
      i18n: { en: "Reason for annulment", es: "Motivo de la anulación." },
    },
    placeholder: {
      code: "FinancialReporting_cancel_placeholder",
      description: "Input placeholder for annulment reason",
      i18n: {
        en: "Describe the reason for annulment.",
        es: "Describe el motivo de la anulación.",
      },
    },
  },
};
