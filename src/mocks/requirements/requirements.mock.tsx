import { MdWarningAmber, MdCheck } from "react-icons/md";

import { AlertCardProps } from "@components/data/AlertCard";

export const mockAlertCards: AlertCardProps[] = [
  {
    icon: <MdWarningAmber />,
    iconAppearance: "warning",
    requirement: "Estar al día en las obligaciones.",
    cause: "El cliente tiene en mora el crédito de vivienda.",
  },
  {
    icon: <MdWarningAmber />,
    iconAppearance: "warning",
    requirement: "Requiere 90 días de antigüedad.",
    cause: "El cliente tiene solo 60 días de afiliación.",
  },
  {
    icon: <MdCheck />,
    iconAppearance: "success",
    requirement: "Tener al menos una obligación con la entidad.",
    cause: "Ninguna.",
  },
  {
    icon: <MdWarningAmber />,
    iconAppearance: "warning",
    requirement: "Ingresos mínimos de $3.000.000 mensuales.",
    cause: "El cliente reporta ingresos de $2.500.000.",
  },
  {
    icon: <MdWarningAmber />,
    iconAppearance: "warning",
    requirement: "No tener reportes negativos en centrales de riesgo.",
    cause: "El cliente tiene un reporte negativo ",
  },
];
