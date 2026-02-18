import { useIAuth } from "@inube/iauth-react";
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
  const { logout } = useIAuth();

  const navigation = {
    nav: {
      reactPortalId: "portal",
      title: "MENU",
      sections: [
        {
          subtitle: "Inicio",
          links: [
            {
              path: "/credit",
              label: "Crédito",
              id: "credit",
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
    breakpoint: "1024px",
  };

  return navigation;
};
const logoutConfig = {
  logoutPath: "/logout",
  logoutTitle: "Cerrar sesión",
};

export const generalHeaderConfig = {
  addBinding: {
    code: "GeneralHeader.addBinding",
    description: "Texto del botón para agregar una nueva vinculación",
    i18n: {
      en: "Add linkage",
      es: "Agregar vinculación",
    },
  },
};

export { appsConfig, logoutConfig, useNavigationConfig };
