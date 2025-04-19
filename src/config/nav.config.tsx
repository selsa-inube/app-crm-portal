import {
  MdLogout,
  MdOutlinePersonOff,
  MdOutlineFilePresent,
  MdBeachAccess,
  MdOutlinePersonalInjury,
  MdOutlineHistoryEdu,
  MdOutlineBadge,
  MdPendingActions,
} from "react-icons/md";
import { useLocation } from "react-router-dom";
import { INavNavigation } from "@inubekit/inubekit";

const useNavConfig = () => {
  const location = useLocation();

  const nav: INavNavigation = {
    title: "MENU",
    sections: {
      administrate: {
        name: "",
        links: {
          holidays: {
            id: "holidays",
            label: "Vacaciones",
            icon: <MdBeachAccess />,
            path: "/holidays",
            isActive: location.pathname.startsWith("/holidays"),
          },
          disability: {
            id: "disability",
            label: "Incapacidades",
            icon: <MdOutlinePersonalInjury />,
            path: "/disability",
            isActive: location.pathname.startsWith("/disability"),
          },
          absences: {
            id: "absences",
            label: "Ausencias",
            icon: <MdOutlinePersonOff />,
            path: "/absences",
            isActive: location.pathname.startsWith("/absences"),
          },
          certifications: {
            id: "certifications",
            label: "Certificaciones",
            icon: <MdOutlineFilePresent />,
            path: "/certifications",
            isActive: location.pathname.startsWith("/certifications"),
          },
          contracts: {
            id: "contracts",
            label: "Contratos",
            icon: <MdOutlineHistoryEdu />,
            path: "/contracts",
            isActive: location.pathname.startsWith("/contracts"),
          },
          charges: {
            id: "charges",
            label: "Cargos",
            icon: <MdOutlineBadge />,
            path: "/charges",
            isActive: location.pathname.startsWith("/charges"),
          },
          requests: {
            id: "requests",
            label: "Solicitudes en tramite",
            icon: <MdPendingActions />,
            path: "/requests",
            isActive: location.pathname.startsWith("/requests"),
          },
        },
      },
    },
  };

  return nav;
};

const userMenu = [
  {
    id: "section",
    title: "",
    links: [
      {
        id: "logout",
        title: "Cerrar sesión",
        path: "/logout",
        iconBefore: <MdLogout />,
      },
    ],
    divider: true,
  },
];

const actions = [
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: <MdLogout />,
    action: () => {
      window.location.href = "/logout";
    },
  },
];

export { useNavConfig, userMenu, actions };
