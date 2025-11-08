import { MdOutlineModeEditOutline } from "react-icons/md";

export const infoIcon = {
  icon: <MdOutlineModeEditOutline />,
  onClick: () => console.log("info"),
};

export const optionSelectDecision = [
  {
    id: "aceptar",
    label: "Aceptar",
    disabled: false,
  },
  {
    id: "rechazar",
    label: "Rechazar",
    disabled: false,
  },
  {
    id: "pendiente",
    label: "Pendiente",
    disabled: false,
  },
];
