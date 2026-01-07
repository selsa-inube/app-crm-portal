import { MdAddCircleOutline } from "react-icons/md";

import { IOptionButtons } from "@components/modals/ListModal";

export const approvalsConfig = {
  title: {
    code: "Evaluate",
    description: "Evaluation modal title",
    i18n: {
      en: "Evaluate",
      es: "Evaluar",
    },
  },

  observations: {
    code: "Observations",
    description: "Observations label",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },

  selectDocument: {
    code: "Select_document",
    description: "Select document instruction",
    i18n: {
      en: "Select the document that corresponds to the requirement.",
      es: "Selecciona el documento que corresponde con el requisito.",
    },
  },

  newDocument: {
    code: "Upload_new_document",
    description: "Upload new document action",
    i18n: {
      en: "Upload new document",
      es: "Cargar documento nuevo",
    },
  },

  answer: {
    code: "Answer",
    description: "Answer label",
    i18n: {
      en: "Answer",
      es: "Respuesta",
    },
  },

  answerPlaceholder: {
    code: "Select_answer",
    description: "Answer select placeholder",
    i18n: {
      en: "Select from the list",
      es: "Selecciona de la lista",
    },
  },

  observationDetails: {
    code: "Observation_details",
    description: "Observation details instruction",
    i18n: {
      en: "Provide details about the requirement evaluation",
      es: "Proporciona detalles acerca de la evaluación del requisito",
    },
  },

  cancel: {
    code: "Cancel",
    description: "Cancel action",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },

  confirm: {
    code: "Confirm",
    description: "Confirm action",
    i18n: {
      en: "Confirm",
      es: "Confirmar",
    },
  },

  see: {
    code: "See",
    description: "See action",
    i18n: {
      en: "View",
      es: "Ver",
    },
  },

  seen: {
    code: "Seen",
    description: "Seen status",
    i18n: {
      en: "Seen",
      es: "Visto",
    },
  },

  titleError: {
    code: "Generic_error_title",
    description: "Generic error title",
    i18n: {
      en: "We are sorry for the inconvenience",
      es: "Lamentamos los inconvenientes",
    },
  },

  maxLength: 200,
};

export const optionsAnswer = [
  {
    id: "compliant",
    code: "Compliant",
    value: "COMPLIANT",
    i18n: {
      en: "Compliant",
      es: "Cumple",
    },
  },
  {
    id: "does_not_comply",
    code: "Not_compliant",
    value: "NOT_COMPLIANT",
    i18n: {
      en: "Does not comply",
      es: "No cumple",
    },
  },
  {
    id: "approve",
    code: "Approve",
    value: "APPROVE",
    i18n: {
      en: "Approve",
      es: "Aprobar",
    },
  },
  {
    id: "reject",
    code: "Reject_and_cancel",
    value: "REJECT",
    i18n: {
      en: "Does not comply and reject request",
      es: "No cumple y rechazar solicitud",
    },
  },
];

export const optionButtons: IOptionButtons = {
  label: "Adjuntar archivo",
  variant: "none",
  icon: <MdAddCircleOutline />,
  fullwidth: false,
  onClick: () => {},
};

export const requirementStatus = [
  {
    code: "Unvalidated_system_validation",
    value: "NOT_EVALUATED",
    requirementType: "SYSTEM_VALIDATION",
    description: {
      en: "The system could not perform the validation because some data is missing.",
      es: "El sistema no pudo realizar la validación porque faltan datos.",
    },
  },
  {
    code: "Passed_system_validation",
    value: "PASSED",
    requirementType: "SYSTEM_VALIDATION",
    description: {
      en: "The system performed the validation and the condition(s) are met.",
      es: "El sistema realizó la validación y se cumplen las condiciones.",
    },
  },
  {
    code: "Ignored_by_user_system_validation",
    value: "PASSED_FORCED",
    requirementType: "SYSTEM_VALIDATION",
    description: {
      en: "The system validation failed but was forcibly approved by a user.",
      es: "La validación falló pero fue aprobada forzosamente por un usuario.",
    },
  },
  {
    code: "Failed_system_validation",
    value: "FAILED",
    requirementType: "SYSTEM_VALIDATION",
    description: {
      en: "The system performed the validation and the condition(s) are not met.",
      es: "El sistema realizó la validación y no se cumplen las condiciones.",
    },
  },

  {
    code: "Document_unvalidated",
    value: "NOT_EVALUATED",
    requirementType: "DOCUMENT",
    description: {
      en: "Documents have not yet been uploaded.",
      es: "Los documentos aún no han sido cargados.",
    },
  },
  {
    code: "Document_validated",
    value: "PASSED",
    requirementType: "DOCUMENT",
    description: {
      en: "Documents were uploaded and validated by a human.",
      es: "Los documentos fueron cargados y validados por una persona.",
    },
  },
  {
    code: "Failed_document_validation",
    value: "FAILED",
    requirementType: "DOCUMENT",
    description: {
      en: "Documents were uploaded but failed validation.",
      es: "Los documentos fueron cargados pero no pasaron la validación.",
    },
  },

  {
    code: "Unvalidated_human_validation",
    value: "NOT_EVALUATED",
    requirementType: "HUMAN_VALIDATION",
    description: {
      en: "The requirement has not yet been validated by a human.",
      es: "El requisito aún no ha sido validado por una persona.",
    },
  },
  {
    code: "Passed_human_validation",
    value: "PASSED",
    requirementType: "HUMAN_VALIDATION",
    description: {
      en: "The requirement was validated by a human.",
      es: "El requisito fue validado por una persona.",
    },
  },
  {
    code: "Failed_human_validation",
    value: "FAILED",
    requirementType: "HUMAN_VALIDATION",
    description: {
      en: "The requirement did not meet the requested criteria.",
      es: "El requisito no cumplió con los criterios solicitados.",
    },
  },
];

export const dataFlags = {
  duration: 5000,
};
