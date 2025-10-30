import { MdOutlineShare, MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon, Stack } from "@inubekit/inubekit";

import { IEntries } from "@components/data/TableBoard/types";
import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";

const entrySelection = (data: IEntries) => {
  console.log(data);
};

export const titlesFinanacialReporting = [
  {
    id: "No. de Obligación",
    titleName: "No. de Obligación",
    priority: 1,
  },
  {
    id: "No. de Documento",
    titleName: "No. de Documento",
    priority: 2,
  },
  {
    id: "Tipo",
    titleName: "Tipo",
    priority: 3,
  },
  {
    id: "tag",
    titleName: "Estado",
    priority: 4,
  },
];

export const actionsFinanacialReporting = [
  {
    id: "Reenviar",
    actionName: "Reenviar",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        cursorHover
        size="22px"
        variant="empty"
        icon={<MdOutlineShare />}
        onClick={() => entrySelection(data)}
        spacing="narrow"
      />
    ),
  },
  {
    id: "ver imagen",
    actionName: "Ver Imagen",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        variant="empty"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
];

export const infoItems = [
  { icon: <MdOutlineShare />, text: "Reenviar", appearance: "primary" },
  {
    icon: <MdOutlineRemoveRedEye />,
    text: "Ver Imagen",
    appearance: "primary",
  },
];

export const actionMobile = [
  {
    id: "Reenviar",
    actionName: "Reenviar",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        cursorHover
        icon={<MdOutlineShare />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
  {
    id: "ver imagen",
    actionName: "Ver Imagen",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
];

export const appearanceTag = (
  tag: string,
): "success" | "warning" | "danger" => {
  const appearance: Record<string, "success" | "warning" | "danger"> = {
    Firmado: "success",
    "En tramite": "warning",
    "Con error": "danger",
  };

  return appearance[tag] || "danger";
};

export const firstWord = (text: string) => text.split(" ")[0];

export const getTableBoardActions = (
  entrySelection: (data: IEntries) => void,
) =>
  actionsFinanacialReporting.map((action) => ({
    id: action.id,
    actionName: action.actionName,
    label: "Action Label",
    content: (data: IEntries) => (
      <Icon
        {...action.content(data).props}
        onClick={() => {
          if (action.id === "Reenviar") {
            entrySelection(data);
          }
        }}
      />
    ),
  }));

export const getTableBoardActionMobile = (
  entrySelection: (data: IEntries) => void,
) =>
  actionMobile.map((action) => ({
    id: action.id,
    actionName: action.actionName,
    label: "Mobile Action Label",
    content: (data: IEntries) => (
      <Icon
        {...action.content(data).props}
        onClick={() => {
          if (action.id === "Reenviar") {
            entrySelection(data);
          }
        }}
      />
    ),
  }));

const getIconByTagStatus = (tagElement: React.ReactElement) => {
  const label = tagElement.props.label;

  if (label === "Firmado") {
    return <img src={check} alt="Cumple" width={14} height={14} />;
  } else if (label === "En tramite") {
    return <img src={remove} alt="Sin Evaluar" width={14} height={14} />;
  } else if (label === "Con error") {
    return <img src={close} alt="No Cumple" width={14} height={14} />;
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
