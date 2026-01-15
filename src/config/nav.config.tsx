import { EnumType } from "@hooks/useEnum/useEnum";
import { MdLogout, MdOutlineCreditCard } from "react-icons/md";
import { useLocation } from "react-router-dom";

const useNavConfig = (lang: EnumType) => {
  const location = useLocation();

  const nav = {
    title: {
      en: "MENU",
      es: "MENÚ",
    },
    sections: {
      administrate: {
        name: {
          en: "Management",
          es: "Administración",
        },
        links: {
          credits: {
            id: "credit",
            label: {
              en: "Credit",
              es: "Crédito",
            },
            icon: <MdOutlineCreditCard />,
            path: "/credit",
            isActive: location.pathname.startsWith("/credit"),
          },
        },
      },
    },
  };

  return {
    title: nav.title[lang],
    sections: {
      administrate: {
        name: nav.sections.administrate.name[lang],
        links: {
          credits: {
            ...nav.sections.administrate.links.credits,
            label: nav.sections.administrate.links.credits.label[lang],
          },
        },
      },
    },
  };
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
    label: {
      code: "Logout_label",
      description: "Logout button label",
      i18n: {
        en: "Logout",
        es: "Cerrar sesión",
      },
    },
    icon: <MdLogout />,
    action: () => {
      window.location.href = "/logout";
    },
  },
];

export { useNavConfig, userMenu, actions };
