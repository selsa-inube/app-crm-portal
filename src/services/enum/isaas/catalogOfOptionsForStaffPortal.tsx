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
  url: string;
  subOptions?: {
    id: string;
    url: string;
  }[];
}

export const OptionStaffPortal: IOptionStaffPortalItem[] = [
  {
    id: "Crédito",
    url: "/credit",
    subOptions: [
      {
        id: "Prospectos de crédito",
        url: "/credit/prospects",
      },
      {
        id: "Solicitudes de crédito",
        url: "/credit/credit-requests",
      },
      {
        id: "Adelanto de nómina",
        url: "/credit",
      },
      {
        id: "Solicitudes tramitadas",
        url: "/credit/processed-credit-requests",
      },
    ],
  },
];
