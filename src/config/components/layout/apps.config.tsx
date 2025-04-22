import { MdVpnKey } from "react-icons/md";

const appsConfig = [
  {
    id: 1,
    label: "Credit",
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
        path: "/credit",
        label: "Crédito",
        id: "/credit",
        isActive: true,
      },
    ],
    url: "/credit",
  },
];

const navigationConfig = {
  title: "MENU",
  sections: {
    administrate: {
      links: {
        board: {
          id: "credit",
          label: "Crédito",
          icon: <MdVpnKey />,
          path: "/credit",
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
