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
  title: "Prospectos de crédito",
  subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const errorDataCredit = {
  noBusinessUnit:
    "No hay una unidad de negocio relacionada con el código del portal.",
  noSelectClient: "No se ha seleccionado ningún cliente.",
  errorData: "No se han podido obtener las opciones de personal.",
  noData: "Este cliente aún no tiene opciones de crédito.",
  noUrl: "No puedes ir a la ruta seleccionada.",
};
export const advancePaymentModal = {
  title: "Nómina o prima",
  titleRoster: "Nómina",
  subtitleRoster: "Es un adelanto de tu salario o nómina mensual.",
  titleAdvance: "Prima",
  subtitleAdvance:
    "Es un adelanto prima de servicios, que se paga cada 6 meses.",
  description: "Selecciona si necesitas un adelanto de nómina o prima.",
  nextButtonText: "Entendido",
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
