import { MdWarningAmber } from "react-icons/md";
import { Icon, Stack } from "@inubekit/inubekit";

import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";

interface IEntries {
  id: string;
  [key: string]: React.ReactNode;
}

export const dataRequirementsNotMet = {
  title: "Requisitos",
  close: "Cerrar",
};

export const dataError = {
  titleError: "Algo salió mal",
  descriptionError: "No se pudo obtener los requistos de la solicitud.",
  noData: "El cliente no presenta restricción por requisitos en este momento.",
  loadRequirements: "Cargando requisitos...",
};

export const titlesRequirementsModal = [
  {
    id: "requierement",
    titleName: "Validaciones del sistema",
    priority: 1,
  },
  {
    id: "tag",
    titleName: "",
    priority: 2,
  },
  {
    id: "action",
    titleName: "",
    priority: 3,
  },
];

export const actionsRequirementsModal = [
  {
    id: "Error",
    actionName: "Error",
    content: (data: IEntries) => {
      const error = Boolean(data.error);
      return (
        <Icon
          icon={<MdWarningAmber />}
          appearance="warning"
          spacing="narrow"
          cursorHover
          size="22px"
          disabled={!error}
        />
      );
    },
  },
];

const getIconByTagStatus = (tagElement: React.ReactElement) => {
  const label = tagElement.props.label;

  if (label === "Aprobado") {
    return <img src={check} alt="Cumple" width={14} height={14} />;
  } else if (label === "Rechazado") {
    return <img src={close} alt="No Cumple" width={14} height={14} />;
  } else if (label === "Pendiente" || label === "En revisión") {
    return <img src={remove} alt="Sin Evaluar" width={14} height={14} />;
  } else {
    return null;
  }
};

export const getActionsMobileIcon = () => {
  return [
    {
      id: "estado",
      actionName: "",
      content: (entry: IEntries) => {
        const tagElement = entry.tag as React.ReactElement;
        return (
          <Stack>
            <Icon
              icon={getIconByTagStatus(tagElement)}
              appearance={tagElement.props.appearance}
              cursorHover
              size="20px"
            />
          </Stack>
        );
      },
    },
  ];
};
