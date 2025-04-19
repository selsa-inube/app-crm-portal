import { MdOutlineHighlightOff, MdOutlineRemoveRedEye } from "react-icons/md";
import { IAction } from "./type";

export const Actions = (onClickDetails?: () => void, onClickEliminate?: () => void): IAction[] => {
  return [
    {
      icon: <MdOutlineRemoveRedEye />,
      appearance: "dark",
      label: "Detalles",
      onClick: onClickDetails,
    },
    {
      icon: <MdOutlineHighlightOff />,
      appearance: "danger",
      label: "Eliminar",
      onClick: onClickEliminate,
    },
  ];
};
