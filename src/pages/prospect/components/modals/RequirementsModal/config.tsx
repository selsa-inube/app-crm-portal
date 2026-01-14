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
  title: {
    code: "Requirements",
    description: "requirements",
    i18n: {
      en: "Requirements",
      es: "Requisitos",
    },
  },
  close: {
    code: "Close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
};

export const dataError = {
  titleError: {
    code: "Title_error",
    description: "Generic error title",
    i18n: {
      en: "Something went wrong",
      es: "Algo salió mal",
    },
  },
  descriptionError: {
    code: "Description_error",
    description: "Request requirements load error",
    i18n: {
      en: "The request requirements could not be obtained.",
      es: "No se pudo obtener los requistos de la solicitud.",
    },
  },
  noData: {
    code: "No_data",
    description: "No requirements restriction message",
    i18n: {
      en: "The client currently has no requirements restrictions.",
      es: "El cliente no presenta restricción por requisitos en este momento.",
    },
  },
  loadRequirements: {
    code: "Load_requirements",
    description: "Loading requirements label",
    i18n: {
      en: "Loading requirements...",
      es: "Cargando requisitos...",
    },
  },
};

export const titlesRequirementsModal = [
  {
    id: "requierement",
    titleName: {
      code: "Requirement_title",
      description: "System validations title",
      i18n: {
        en: "System validations",
        es: "Validaciones del sistema",
      },
    },
    priority: 1,
  },
  {
    id: "tag",
    titleName: {
      code: "Tag_title",
      description: "Tag column title",
      i18n: {
        en: "",
        es: "",
      },
    },
    priority: 2,
  },
  {
    id: "action",
    titleName: {
      code: "Action_title",
      description: "Action column title",
      i18n: {
        en: "",
        es: "",
      },
    },
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
