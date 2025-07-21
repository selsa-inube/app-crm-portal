import { ReactElement } from "react";
import { MdMoneyOff, MdOutlineAttachMoney } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const addConfig = {
  id: 1,
  title: "Crédito",
  route: "/",
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
      onClick: () => navigate("/credit/simulations"),
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
