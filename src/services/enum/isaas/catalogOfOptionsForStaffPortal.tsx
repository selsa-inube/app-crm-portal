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
        descriptionUse: "Gestiona las solicitudes de crédito del cliente.",
        url: "/credit/credit-requests",
      },
      {
        id: "Solicitudes tramitadas",
        icon: getIconByName("MdOutlineAssignmentTurnedIn"),
        descriptionUse:
          "Gestiona las solicitudes de crédito tramitadas del cliente.",
        url: "/credit",
      },
    ],
  },
];
