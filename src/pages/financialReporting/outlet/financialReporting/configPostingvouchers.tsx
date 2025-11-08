import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { IEntries } from "@components/data/TableBoard/types";

const entrySelection = (data: IEntries) => {
  console.log(data);
};

export const titlesPostingvouchers = [
  {
    id: "No. de Obligación",
    titleName: "No. de Obligación",
    priority: 1,
  },
  {
    id: "No. de Documento",
    titleName: "No. de Documento",
    priority: 2,
  },
];

export const entriesPostingvouchers = [
  {
    id: "1",
    "No. de Obligación": "1234554545",
    "No. de Documento": "NC - 9876543210",
  },
  {
    id: "2",
    "No. de Obligación": "1234567890",
    "No. de Documento": "NC - 9876556789",
  },
  {
    id: "3",
    "No. de Obligación": "1234564321",
    "No. de Documento": "OP - 3456789123",
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
        variant="filled"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
];
