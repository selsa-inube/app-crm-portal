import { MdAddCircleOutline } from "react-icons/md";

import { IOptionButtons } from "@components/modals/ListModal";

export const approvalsConfig = {
  title: "Evaluar",
  observations: "Observaciones",
  selectDocument: "Selecciona el documento que corresponde con el requisito.",
  newDocument: "Cargar documento nuevo",
  answer: "Respuesta",
  answerPlaceHoleder: "Selecciona de la lista",
  observationdetails:
    "Proporciona detalles acerca de la evaluación del requisito",
  cancel: "Cancelar",
  confirm: "Confirmar",
  see: "Ver",
  seen: "Visto",
  titleError: "Lamentamos los inconvenientes",
  maxLength: 200,
};

export const optionsAnswer = [
  {
    id: "compliant",
    label: "Cumple",
    value: "Cumple",
  },
  {
    id: "does_not_comply",
    label: "No cumple",
    value: "No cumple",
  },
  { id: "approve", label: "Aprobar", value: "Aprobar" },
  {
    id: "reject",
    label: "No cumple y rechazar solicitud",
    value: "No cumple y rechazar solicitud",
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
    Code: "UNVALIDATED_SYSTEM_VALIDATION",
    Value: "Not Evaluated",
    Description:
      "The system could not perform the validation because some data is missing.",
  },
  {
    Code: "PASSED_WITH_SYSTEM_VALIDATION",
    Value: "Passed",
    Description:
      "The system performed the validation and the condition(s) are met.",
    RequirementType: "SYSTEM_VALIDATION",
  },
  {
    Code: "IGNORED_BY_THE_USER_SYSTEM_VALIDATION",
    Value: "Passed*",
    Description:
      "The system performed the validation and the condition(s) are not met, but then a user forcibly approved it. This use case is explained later.",
    RequirementType: "SYSTEM_VALIDATION",
  },
  {
    Code: "FAILED_SYSTEM_VALIDATION",
    Value: "Failed",
    Description:
      "The system performed the validation and the condition(s) are not met.",
    RequirementType: "SYSTEM_VALIDATION",
  },
  {
    Code: "DOCUMENT_UNVALIDATED",
    Value: "Not Evaluated",
    Description:
      "The file(s) with the scanned image or the document in standard format have not yet been uploaded.",
    RequirementType: "DOCUMENT",
  },
  {
    Code: "DOCUMENT_STORED_AND_VALIDATED",
    Value: "Passed",
    Description:
      "The file(s) were uploaded and a human performed a visual check to ensure they are correct and appropriate.",
    RequirementType: "DOCUMENT",
  },
  {
    Code: "FAILED_DOCUMENT_VALIDATION",
    Value: "Failed",
    Description:
      "The file(s) were uploaded, but during the human validation the content did NOT match the requirements, was illegible, incomplete, or had some other issue preventing acceptance.",
    RequirementType: "DOCUMENT",
  },
  {
    Code: "INVALID_DOCUMENT_CANCELS_REQUEST",
    Value: "Cancels request due to invalid document.",
    Description:
      "The uploaded images or documents do NOT match the required ones or are not suitable, and the person responsible for providing them (client, employee, supplier, co-signer, etc.) confirms they cannot provide them. Therefore, an official decides to cancel the request or procedure as it is mandatory.",
    RequirementType: "DOCUMENT",
  },
  {
    Code: "DOCUMENT_IGNORED_BY_THE_USER",
    Value: "Passed*",
    Description:
      "When a human forcibly approves the requirement even though it does not match or is not suitable. The use case for forced approval is explained later.",
    RequirementType: "DOCUMENT",
  },
  {
    Code: "UNVALIDATED_HUMAN_VALIDATION",
    Value: "Not Evaluated",
    Description:
      "The requirement was just added (as configured in the rule), but has not yet been validated by a human.",
    RequirementType: "HUMAN_VALIDATION",
  },
  {
    Code: "PASSED_HUMAN_VALIDATION",
    Value: "Passed",
    Description:
      "The requirement was validated by a human, who confirms it meets the requested criteria.",
    RequirementType: "HUMAN_VALIDATION",
  },
  {
    Code: "FAILED_HUMAN_VALIDATION",
    Value: "Failed",
    Description:
      "A human identifies that the requirement was NOT met by the responsible person or does NOT meet the requested criteria.",
    RequirementType: "HUMAN_VALIDATION",
  },
  {
    Code: "VALIDATION_FAILED_CANCELS_REQUEST",
    Value: "Cancels request due to validation failure",
    Description:
      "A human identifies that the requirement was NOT met or does NOT comply, and an official decides to cancel the request or procedure as it is mandatory.",
    RequirementType: "HUMAN_VALIDATION",
  },
];

export const dataFlags = {
  duration: 5000,
};
