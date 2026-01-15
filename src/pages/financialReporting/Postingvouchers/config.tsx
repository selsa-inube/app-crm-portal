import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { IEntries } from "@components/data/TableBoard/types";

const entrySelection = (data: IEntries) => {
  console.log(data);
};

export const titlesPostingvouchers = [
  {
    id: "obligationCode",
    titleName: {
      code: "PostingVouchers_title_obligationCode",
      description: "Obligation number column title",
      i18n: {
        en: "Obligation No.",
        es: "No. de Obligación",
      },
    },
    priority: 1,
  },
  {
    id: "documentCode",
    titleName: {
      code: "PostingVouchers_title_documentCode",
      description: "Document number column title",
      i18n: {
        en: "Document No.",
        es: "No. de Documento",
      },
    },
    priority: 2,
  },
];

export const actionsPostingvouchers = [
  {
    id: "ver imagen",
    actionName: {
      code: "PostingVouchers_action_viewImage",
      description: "View image action",
      i18n: {
        en: "View image",
        es: "Ver Imagen",
      },
    },
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        variant="empty"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
];

export const actionMobile = actionsPostingvouchers.map((action) => ({
  id: action.id,
  content: (data: IEntries) => (
    <div onClick={() => entrySelection(data)}>{action.content(data)}</div>
  ),
}));
