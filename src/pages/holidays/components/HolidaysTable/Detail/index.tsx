import { useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { Stack, Icon } from "@inubekit/inubekit";

import { ActionModal } from "../Actions";

interface DetailProps {
  onClickDetails?: () => void;
  onClickEdit?: () => void;
  onClickEliminate?: () => void;
  disableDeleteAction?: boolean;
}

export function Detail(props: DetailProps) {
  const { onClickDetails, onClickEdit, onClickEliminate, disableDeleteAction } = props;
  const [ModalOpen, setModalOpen] = useState(false);
  return (
    <Stack justifyContent="center">
      <Icon
        icon={<MdOutlineMoreVert />}
        size="16px"
        cursorHover
        appearance="primary"
        onClick={() => setModalOpen(true)}
        shape="circle"
        variant="filled"
      />
      {ModalOpen && (
        <ActionModal
          onClose={() => setModalOpen(false)}
          onClickDetails={onClickDetails}
          onClickEdit={onClickEdit}
          onClickEliminate={onClickEliminate}
          disableDeleteAction={disableDeleteAction}
        />
      )}
    </Stack>
  );
}
