import { ReactElement } from "react";
import { MdMoneyOff, MdOutlineAttachMoney } from "react-icons/md";

export const addConfig = {
  id: 1,
  title: "Crédito",
  route: "/credit",
  crumbs: [
    {
      path: "/",
      label: "Inicio",
      id: "/home",
      isActive: true,
    },
    {
      path: "/credit",
      label: "credito",
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

export const creditCards: CreditCardCfg[] = [
  {
    key: "credit",
    icon: <MdOutlineAttachMoney />,
    title: "Prospectos de crédiito",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    onClick: () => console.log("Crédito"),
  },
  {
    key: "advance",
    icon: <MdMoneyOff />,
    title: "Solicitudes de crédito",
    subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    onClick: () => console.log("Anticipo salarial"),
  },
];
