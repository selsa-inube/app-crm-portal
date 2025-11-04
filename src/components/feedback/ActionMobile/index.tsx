import { useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { ActionModal } from "./Actions";

export interface ActionMobileProps {
  handleEdit?: () => void;
  handleView?: () => void;
  handleDelete?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ActionMobile(props: ActionMobileProps) {
  const {
    handleEdit = () => {},
    handleView = () => {},
    handleDelete = () => {},
    isOpen = false,
    onToggle = () => {},
  } = props;

  return (
    <>
      <Icon
        icon={<MdOutlineMoreVert />}
        size="16px"
        cursorHover
        appearance="primary"
        onClick={onToggle}
        shape="circle"
        variant="filled"
      />
      {isOpen && (
        <ActionModal
          onClose={onToggle}
          handleDelete={() => {
            handleDelete();
            onToggle();
          }}
          handleEdit={() => {
            handleEdit();
            onToggle();
          }}
          handleView={() => {
            handleView();
            onToggle();
          }}
        />
      )}
    </>
  );
}
