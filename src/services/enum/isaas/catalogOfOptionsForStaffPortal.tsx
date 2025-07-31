import React from "react";
import * as MdIcons from "react-icons/md";

export const getIconByName = (iconName: string): React.ReactNode => {
  const IconComponent = (MdIcons as Record<string, React.ComponentType>)[
    iconName
  ];
  return IconComponent ? <IconComponent /> : null;
};

interface IOptionStaffPortalItem {
  id: string;
  icon: React.ReactNode;
  descriptionUse: string;
  url: string;
  subOptions?: {
    id: string;
    icon: React.ReactNode;
    descriptionUse: string;
    url: string;
  }[];
}

export const OptionStaffPortal: IOptionStaffPortalItem[] = [
  {
    id: "Crédito",
    icon: getIconByName("MdOutlineAccountBalance"),
    descriptionUse: "Gestiona tus opciones de crédito",
    url: "/credit",
    subOptions: [
      {
        id: "Prospectos de crédito",
        icon: getIconByName("MdOutlineAttachMoney"),
        descriptionUse: "Gestiona los prospectos de crédito del cliente.",
        url: "/credit/prospects",
      },
      {
        id: "Solicitudes de crédito",
        icon: getIconByName("MdMoneyOff"),
        descriptionUse:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "/credit/prospects-2",
      },
    ],
  },
  {
    id: "Ahorros",
    icon: getIconByName("MdOutlineSavings"),
    descriptionUse: "Gestiona tus opciones de ahorro",
    url: "/",
  },
  {
    id: "Pagos",
    icon: getIconByName("MdOutlinePayments"),
    descriptionUse: "Gestiona tus opciones de pago",
    url: "/",
  },
  {
    id: "Tarjetas",
    icon: getIconByName("MdCreditCard"),
    descriptionUse: "Gestiona tus opciones de tarjeta",
    url: "/",
  },
  {
    id: "Auxilios",
    icon: getIconByName("MdOutlineSupport"),
    descriptionUse: "Gestiona tus opciones de auxilios",
    url: "/",
  },
  {
    id: "Transferencias",
    icon: getIconByName("MdCompareArrows"),
    descriptionUse: "Gestiona tus opciones de transferencia",
    url: "/",
  },
];
