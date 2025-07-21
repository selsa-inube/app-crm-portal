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
}

export const OptionStaffPortal: IOptionStaffPortalItem[] = [
  {
    id: "Credito",
    icon: getIconByName("MdOutlineAccountBalance"),
    descriptionUse: "Manage your credit options",
    url: "/credit",
  },
  {
    id: "Ahorros",
    icon: getIconByName("MdOutlineSavings"),
    descriptionUse: "Manage your savings options",
    url: "/",
  },
  {
    id: "Pagos",
    icon: getIconByName("MdOutlinePayments"),
    descriptionUse: "Manage your payment options",
    url: "/",
  },
  {
    id: "Tarjetas",
    icon: getIconByName("MdCreditCard"),
    descriptionUse: "Manage your card options",
    url: "/",
  },
  {
    id: "Auxilios",
    icon: getIconByName("MdOutlineSupport"),
    descriptionUse: "Manage your support options",
    url: "/",
  },
  {
    id: "Transferencias",
    icon: getIconByName("MdCompareArrows"),
    descriptionUse: "Manage your transfer options",
    url: "/",
  },
];
