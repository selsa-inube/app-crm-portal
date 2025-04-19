import {
  MdOutlineBadge,
  MdOutlinePhone,
  MdOutlineAssignment,
  MdOutlineMedicalServices,
  MdOutlinePayments,
  MdOutlineEditNote,
  MdOutlineAssignmentTurnedIn,
  MdCheck,
} from "react-icons/md";

import { TaskCardProps } from "@pages/requests/ApplicationProcess/Components/TaskCard";

export const mockPendingTasks: TaskCardProps[] = [
  {
    id: "1",
    title: "Datos generales del empleado",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineBadge />,
  },
  {
    id: "2",
    title: "Datos de contacto del empleado",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlinePhone />,
  },
  {
    id: "3",
    title: "Completar datos de vinculación",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineAssignment />,
  },
  {
    id: "4",
    title: "Gestionar exámenes médicos",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineMedicalServices />,
  },
  {
    id: "5",
    title: "Asignaciones de la remuneración",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlinePayments />,
  },
  {
    id: "6",
    title: "Gestionar firmas",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineEditNote />,
    hasNoPrivileges: true,
  },
  {
    id: "7",
    title: "Aprobar solicitud",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineAssignmentTurnedIn />,
    hasNoPrivileges: true,
  },
  {
    id: "8",
    title: "Confirmar inicio",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdCheck />,
    hasNoPrivileges: true,
  },
];

export const mockCompletedTasks: TaskCardProps[] = [
  {
    id: "1",
    title: "Datos generales del empleado",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineBadge />,
  },
  {
    id: "2",
    title: "Datos de contacto del empleado",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlinePhone />,
  },
  {
    id: "3",
    title: "Completar datos de vinculación",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineAssignment />,
  },
  {
    id: "4",
    title: "Gestionar exámenes médicos",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: <MdOutlineMedicalServices />,
  },
];
