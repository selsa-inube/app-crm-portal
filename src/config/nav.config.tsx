import { MdLogout, MdOutlineCreditCard } from "react-icons/md";
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
          credits: {
            id: "credit",
            label: "Crédito",
            icon: <MdOutlineCreditCard />,
            path: "/credito",
            isActive: location.pathname.startsWith("/credit"),
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
