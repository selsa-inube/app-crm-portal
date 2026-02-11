import { MdCancel, MdCheckCircle, MdOutlineAccessTime } from "react-icons/md";

type AppearanceType =
  | "success"
  | "danger"
  | "primary"
  | "warning"
  | "help"
  | "dark"
  | "gray"
  | "light";

export const appearanceTag = (label: string = "") => {
  const config: Record<
    string,
    { appearance: AppearanceType; icon: JSX.Element }
  > = {
    Activo: { appearance: "success", icon: <MdCheckCircle /> },
    Vinculado: { appearance: "success", icon: <MdCheckCircle /> },
    Inactivo: { appearance: "warning", icon: <MdCheckCircle /> },
    "En proceso devinculación": {
      appearance: "warning",
      icon: <MdOutlineAccessTime />,
    },
    "En proceso de retiro": { appearance: "danger", icon: <MdCancel /> },
    Retirado: { appearance: "danger", icon: <MdCancel /> },
  };
  return config[label] || { appearance: "danger", icon: "" };
};

export const tittleHeader = {
  title: {
    code: "Title",
    description: "Client",
    i18n: { en: "Client", es: "Cliente" },
  },
};
