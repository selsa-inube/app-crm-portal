import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { IEntries } from "@components/data/TableBoard/types";

const entrySelection = (data: IEntries) => {
  console.log(data);
};

export const titlesPostingvouchers = [
  {
    id: "obligationCode",
    titleName: "No. de Obligación",
    priority: 1,
  },
  {
    id: "documentCode",
    titleName: "No. de Documento",
    priority: 2,
  },
];

export const actionsPostingvouchers = [
  {
    id: "ver imagen",
    actionName: "Ver Imagen",
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
