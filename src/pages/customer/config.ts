export const homeData = {
  selectClient: {
    code: "Home_selectClient",
    description: "Select client label",
    i18n: {
      en: "Select client",
      es: "Selecciona el cliente",
    },
  },
  text: {
    code: "Home_text",
    description: "Client selection helper text",
    i18n: {
      en: "Enter the ID and/or name of the client you want to select.",
      es: "Digita la cédula y/o nombre del cliente que quieres seleccionar.",
    },
  },
  continue: {
    code: "Home_continue",
    description: "Continue button label",
    i18n: {
      en: "Continue",
      es: "Continuar",
    },
  },
  noSelectClient: {
    code: "Home_noSelectClient",
    description: "No client selected warning message",
    i18n: {
      en: "To continue, you must first select a client.",
      es: "Para continuar, primero debes seleccionar un cliente.",
    },
  },
};

export enum EErrorMessages {
  NoClientSelected = "Para continuar, primero debes seleccionar un cliente.",
  ClientNotFound = "El cliente no se encuentra registrado.",
}

export const VALIDATE_BLANK_SPACES_REGEX = /\s/g;
