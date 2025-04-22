import {
  MdDeleteOutline,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

interface Action {
  icon: React.ReactNode;
  appearance:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "help"
    | "dark"
    | "gray"
    | "light";
  label: string;
}

export const dataActions: Action[] = [
  {
    icon: <MdOutlineRemoveRedEye />,
    appearance: "dark",
    label: "Ver detalles",
  },
  { icon: <MdOutlineEdit />, appearance: "dark", label: "Editar" },
  { icon: <MdDeleteOutline />, appearance: "danger", label: "Eliminar" },
];
