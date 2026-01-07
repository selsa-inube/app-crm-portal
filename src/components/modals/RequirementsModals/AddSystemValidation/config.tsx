export const requirementJustificationMap: Record<
  string,
  {
    code: string;
    description: string;
    i18n: {
      en: string;
      es: string;
    };
  }
> = {
  "El asociado tiene más de 20 años de edad.": {
    code: "Age_requirement_validation",
    description: "Minimum age requirement validation",
    i18n: {
      en: "Minimum age requirement is validated",
      es: "Se valida la edad mínima para el requisito",
    },
  },

  "Antiguedad minima": {
    code: "Minimum_seniority_validation",
    description: "Minimum seniority requirement validation",
    i18n: {
      en: "Minimum seniority requirement is validated",
      es: "Se valida la antigüedad mínima para el requisito",
    },
  },
};

export const validationMessages = {
  requiredField: {
    code: "Required_field",
    description: "Required field validation message",
    i18n: {
      en: "This field is required",
      es: "Este campo es obligatorio",
    },
  },
};

export const systemValidationData = {
  selectOption: {
    code: "Select_option",
    description: "Select option placeholder",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },

  noAvailable: {
    code: "No_available_options",
    description: "No available options message",
    i18n: {
      en: "No options available",
      es: "No hay opciones disponibles",
    },
  },
};
