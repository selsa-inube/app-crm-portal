import { useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { ActionModal } from "./Actions";

export interface ActionMobileProps {
  handleEdit?: () => void;
  handleView?: () => void;
  handleDelete?: () => void;
}

export function ActionMobile(props: ActionMobileProps) {
  const {
    handleEdit = () => {},
    handleView = () => {},
    handleDelete = () => {},
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Icon
        icon={<MdOutlineMoreVert />}
        size="16px"
        cursorHover
        appearance="primary"
        onClick={() => setModalOpen(true)}
        shape="circle"
        variant="filled"
      />
      {modalOpen && (
        <ActionModal
          onClose={() => setModalOpen(false)}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleView={handleView}
        />
      )}
    </>
  );
}
