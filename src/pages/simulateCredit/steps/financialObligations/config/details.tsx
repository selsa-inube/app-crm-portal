import { useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { ActionModal } from "./actions";

export function Details() {
  const [ModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Icon
        icon={<MdOutlineMoreVert />}
        size="12px"
        cursorHover
        appearance="primary"
        onClick={() => setModalOpen(true)}
        shape="circle"
        variant="filled"
      />
      {ModalOpen && <ActionModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
