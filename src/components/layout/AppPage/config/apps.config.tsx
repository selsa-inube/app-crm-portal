import { useAuth0 } from "@auth0/auth0-react";
import { MdLogout, MdOutlineCreditCard, MdVpnKey } from "react-icons/md";

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
const useNavigationConfig = () => {
  const { logout } = useAuth0();

  const navigation = {
    nav: {
      reactPortalId: "portal",
      title: "MENU",
      sections: [
        {
          subtitle: "Inicio",
          links: [
            {
              path: "/credit/add-prospect/16378491",
              label: "Crédito",
              id: "/credit/add-prospect/16378491",
              icon: <MdOutlineCreditCard />,
            },
          ],
          isOpen: false,
          onClose: () => {},
          onToggle: () => {},
        },
      ],
      actions: [
        {
          id: "logout",
          label: "Cerrar sesión",
          icon: <MdLogout />,
          action: () => {
            localStorage.clear();
            logout({
              logoutParams: {
                returnTo: "/logout",
              },
            });
          },
        },
      ],
      footerLabel: "©2025 - Inube",
      displaySubtitles: true,
      collapse: true,
    },
    breakpoint: "700px",
  };

  return navigation;
};
const logoutConfig = {
  logoutPath: "/logout",
  logoutTitle: "Cerrar sesión",
};

export { appsConfig, logoutConfig, useNavigationConfig };
