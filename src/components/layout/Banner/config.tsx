import { MdOutlineSchedule, MdCancel, MdCheckCircle } from "react-icons/md";

export type StatusKey = "vinculado" | "prospecto" | "proceso" | "retiro" | "retirado";

export interface StatusConfig {
  key: StatusKey;
  color: "success" | "warning" | "danger";
  icon: JSX.Element;
  label: string;
}

export const statusList: StatusConfig[] = [
  {
    key: "vinculado",
    color: "success",
    icon: <MdCheckCircle />,
    label: "Vinculado",
  },
  {
    key: "prospecto",
    color: "warning",
    icon: <MdOutlineSchedule />,
    label: "Prospecto",
  },
  {
    key: "proceso",
    color: "warning",
    icon: <MdOutlineSchedule />,
    label: "En proceso de vinculación",
  },
  {
    key: "retiro",
    color: "danger",
    icon: <MdCancel />,
    label: "En proceso de retiro",
  },
  { key: "retirado", color: "danger", icon: <MdCancel />, label: "Retirado" },
];

export function getStatusConfig(status: string): StatusConfig {
  return (
    statusList.find((item) => item.key === status.toLowerCase()) ?? {
      key: "vinculado",
      color: "success",
      icon: <MdCheckCircle />,
      label: "Vinculado",
    }
  );
}
