import { MdWarningAmber } from "react-icons/md";

import { AlertCardProps } from "@components/data/AlertCard";

export const mockAlertCards: AlertCardProps[] = [
  {
    icon: <MdWarningAmber />,
    title: "Alerta 1",
    iconAppearance: "warning",
    requirement: "Estar al día en las obligaciones.",
    cause: "El cliente tiene en mora el crédito de vivienda.",
  },
  {
    icon: <MdWarningAmber />,
    title: "Alerta 2",
    iconAppearance: "warning",
    requirement: "Requiere 90 días de antigüedad.",
    cause: "El cliente tiene solo 60 días de afiliación.",
  },
];
