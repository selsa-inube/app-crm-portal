import { MdOutlineDoorFront } from "react-icons/md";

export const homeTitleConfig = (username: string) => ({
  title: {
    code: "Home_title",
    description: "Home welcome title",
    i18n: {
      en: `Welcome, ${username}`,
      es: `Bienvenido, ${username}`,
    },
  },
  description: {
    code: "Home_description",
    description: "Home description text",
    i18n: {
      en: "Here are the available features.",
      es: "Aquí tienes las funcionalidades disponibles.",
    },
  },
  icon: <MdOutlineDoorFront />,
  sizeTitle: "large",
});

export const errorDataCredit = {
  noBusinessUnit: {
    code: "Error_Credit_NoBusinessUnit",
    description: "No business unit related to portal code",
    i18n: {
      en: "There is no business unit related to the portal code.",
      es: "No hay una unidad de negocio relacionada con el código del portal.",
    },
  },
  noSelectClient: {
    code: "Error_Credit_NoSelectClient",
    description: "No client selected error",
    i18n: {
      en: "No client has been selected.",
      es: "No se ha seleccionado ningún cliente.",
    },
  },
  errorData: {
    code: "Error_Credit_ErrorData",
    description: "Staff options fetch error",
    i18n: {
      en: "Staff options could not be retrieved.",
      es: "No se han podido obtener las opciones de personal.",
    },
  },
  noData: {
    code: "Error_Credit_NoData",
    description: "No available features for client",
    i18n: {
      en: "This client does not have available features yet.",
      es: "Este cliente aún no tiene funcionalidades disponibles.",
    },
  },
  noUrl: {
    code: "Error_Credit_NoUrl",
    description: "Invalid route navigation error",
    i18n: {
      en: "You cannot navigate to the selected route.",
      es: "No puedes ir a la ruta seleccionada.",
    },
  },
};
