import { MdLogout } from "react-icons/md";

const userMenu = [
  {
    id: "section",
    title: {
      code: "Section_title",
      description: "User menu section title",
      i18n: {
        en: "",
        es: "",
      },
    },
    links: [
      {
        id: "logout",
        title: {
          code: "Logout_title",
          description: "Logout menu option",
          i18n: {
            en: "Logout",
            es: "Cerrar sesión",
          },
        },
        path: "/logout",
        iconBefore: <MdLogout />,
      },
    ],
    divider: true,
  },
];

export { userMenu };
