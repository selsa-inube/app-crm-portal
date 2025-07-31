import { MdDeleteOutline } from "react-icons/md";

interface IAppearance {
  appearance:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "help"
    | "dark"
    | "gray"
    | "light";
}

interface IIconConfig extends IAppearance {
  id: string;
  icon: JSX.Element;
}

export const icons: IIconConfig[] = [
  {
    id: "delete",
    icon: <MdDeleteOutline />,
    appearance: "danger",
  },
];
