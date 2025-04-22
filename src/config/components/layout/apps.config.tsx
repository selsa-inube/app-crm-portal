import { MdVpnKey } from "react-icons/md";

const appsConfig = [
  {
    id: 1,
    label: "Board",
    description: "Gestiona los creditos",
    icon: <MdVpnKey />,
    crumbs: [
      {
        path: "/",
        label: "Inicio",
        id: "/",
        isActive: false,
      },
      {
        path: "/board",
        label: "Crediboard",
        id: "/board",
        isActive: true,
      },
    ],
    url: "/board",
  },
];

const navigationConfig = {
  title: "MENU",
  sections: {
    administrate: {
      links: {
        board: {
          id: "board",
          label: "Crediboard",
          icon: <MdVpnKey />,
          path: "/board",
        },
      },
    },
  },
};

const logoutConfig = {
  logoutPath: "/logout",
  logoutTitle: "Cerrar sesión",
};

export { appsConfig, navigationConfig, logoutConfig };
