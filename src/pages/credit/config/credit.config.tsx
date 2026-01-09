import { ReactElement } from "react";
import { MdMoneyOff, MdOutlineAttachMoney } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const addConfig = {
  id: 1,
  title: "Inicio",
  route: "/home",
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
  ],
};

export const addCredit = {
  title: {
    code: "Title",
    description: "Credit prospects title",
    i18n: { en: "Credit prospects", es: "Prospectos de crédito" },
  },
  subtitle: {
    code: "Subtitle",
    description: "Generic subtitle",
    i18n: {
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      es: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  },
};

export const errorDataCredit = {
  noBusinessUnit: {
    code: "No_business_unit",
    description: "Business unit error message",
    i18n: {
      en: "There is no business unit related to the portal code.",
      es: "No hay una unidad de negocio relacionada con el código del portal.",
    },
  },
  noSelectClient: {
    code: "No_select_client",
    description: "Client not selected error",
    i18n: {
      en: "No client has been selected.",
      es: "No se ha seleccionado ningún cliente.",
    },
  },
  errorData: {
    code: "Error_data",
    description: "Personnel options error",
    i18n: {
      en: "Could not obtain personnel options.",
      es: "No se han podido obtener las opciones de personal.",
    },
  },
  noData: {
    code: "No_data",
    description: "No credit options for client",
    i18n: {
      en: "This client does not have credit options yet.",
      es: "Este cliente aún no tiene opciones de crédito.",
    },
  },
  noUrl: {
    code: "No_url",
    description: "Invalid route error",
    i18n: {
      en: "You cannot go to the selected route.",
      es: "No puedes ir a la ruta seleccionada.",
    },
  },
};

interface CreditCardCfg {
  key: string;
  icon: ReactElement;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export const useCreditCards = (): CreditCardCfg[] => {
  const navigate = useNavigate();

  return [
    {
      key: "credit",
      icon: <MdOutlineAttachMoney />,
      title: "Prospectos de crédito",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      onClick: () => navigate("/credit/prospects"),
    },
    {
      key: "advance",
      icon: <MdMoneyOff />,
      title: "Solicitudes de crédito",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      onClick: () => console.log("Anticipo salarial"),
    },
  ];
};
