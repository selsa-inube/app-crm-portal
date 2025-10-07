import { IDomainEnum } from "@config/enums/types";

export const requirementStatusData: IDomainEnum[] = [
  {
    code: "UNVALIDATED_SYSTEM_VALIDATION",
    value: "Not Evaluated",
    description:
      "The system could not perform the validation because some data is missing.",
    requirementType: undefined,
    i18n: {
      es: "No Evaluado",
      en: "Not Evaluated",
    },
  },
  {
    code: "PASSED_WITH_SYSTEM_VALIDATION",
    value: "Passed",
    description:
      "The system performed the validation and the condition(s) are met.",
    requirementType: "SYSTEM_VALIDATION",
    i18n: {
      es: "Aprobado",
      en: "Passed",
    },
  },
  {
    code: "IGNORED_BY_THE_USER_SYSTEM_VALIDATION",
    value: "Passed*",
    description:
      "The system performed the validation and the condition(s) are not met, but then a user forcibly approved it. This use case is explained later.",
    requirementType: "SYSTEM_VALIDATION",
    i18n: {
      es: "Aprobado*",
      en: "Passed*",
    },
  },
  {
    code: "FAILED_SYSTEM_VALIDATION",
    value: "Failed",
    description:
      "The system performed the validation and the condition(s) are not met.",
    requirementType: "SYSTEM_VALIDATION",
    i18n: {
      es: "Fallido",
      en: "Failed",
    },
  },
  {
    code: "DOCUMENT_UNVALIDATED",
    value: "Not Evaluated",
    description:
      "The file(s) with the scanned image or the document in standard format have not yet been uploaded.",
    requirementType: "DOCUMENT",
    i18n: {
      es: "No Evaluado",
      en: "Not Evaluated",
    },
  },
  {
    code: "DOCUMENT_STORED_AND_VALIDATED",
    value: "Passed",
    description:
      "The file(s) were uploaded and a human performed a visual check to ensure they are correct and appropriate.",
    requirementType: "DOCUMENT",
    i18n: {
      es: "Aprobado",
      en: "Passed",
    },
  },
  {
    code: "FAILED_DOCUMENT_VALIDATION",
    value: "Failed",
    description:
      "The file(s) were uploaded, but during the human validation the content did NOT match the requirements, was illegible, incomplete, or had some other issue preventing acceptance.",
    requirementType: "DOCUMENT",
    i18n: {
      es: "Fallido",
      en: "Failed",
    },
  },
  {
    code: "INVALID_DOCUMENT_CANCELS_REQUEST",
    value: "Cancels request due to invalid document.",
    description:
      "The uploaded images or documents do NOT match the required ones or are not suitable, and the person responsible for providing them (client, employee, supplier, co-signer, etc.) confirms they cannot provide them. Therefore, an official decides to cancel the request or procedure as it is mandatory.",
    requirementType: "DOCUMENT",
    i18n: {
      es: "Cancela solicitud por documento inválido",
      en: "Cancels request due to invalid document",
    },
  },
  {
    code: "DOCUMENT_IGNORED_BY_THE_USER",
    value: "Passed*",
    description:
      "When a human forcibly approves the requirement even though it does not match or is not suitable. The use case for forced approval is explained later.",
    requirementType: "DOCUMENT",
    i18n: {
      es: "Aprobado*",
      en: "Passed*",
    },
  },
  {
    code: "UNVALIDATED_HUMAN_VALIDATION",
    value: "Not Evaluated",
    description:
      "The requirement was just added (as configured in the rule), but has not yet been validated by a human.",
    requirementType: "HUMAN_VALIDATION",
    i18n: {
      es: "No Evaluado",
      en: "Not Evaluated",
    },
  },
  {
    code: "PASSED_HUMAN_VALIDATION",
    value: "Passed",
    description:
      "The requirement was validated by a human, who confirms it meets the requested criteria.",
    requirementType: "HUMAN_VALIDATION",
    i18n: {
      es: "Aprobado",
      en: "Passed",
    },
  },
  {
    code: "FAILED_HUMAN_VALIDATION",
    value: "Failed",
    description:
      "A human identifies that the requirement was NOT met by the responsible person or does NOT meet the requested criteria.",
    requirementType: "HUMAN_VALIDATION",
    i18n: {
      es: "Fallido",
      en: "Failed",
    },
  },
  {
    code: "VALIDATION_FAILED_CANCELS_REQUEST",
    value: "Cancels request due to validation failure",
    description:
      "A human identifies that the requirement was NOT met or does NOT comply, and an official decides to cancel the request or procedure as it is mandatory.",
    requirementType: "HUMAN_VALIDATION",
    i18n: {
      es: "Cancela solicitud por validación fallida",
      en: "Cancels request due to validation failure",
    },
  },
  {
    code: "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
    value: "Passed*",
    description:
      "The requirement was forcibly approved by a human, even though it was NOT presented or does NOT meet the criteria.",
    requirementType: "HUMAN_VALIDATION",
    i18n: {
      es: "Aprobado*",
      en: "Passed*",
    },
  },
];
