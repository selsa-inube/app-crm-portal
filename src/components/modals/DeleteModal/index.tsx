import { Text, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

import { DeleteData } from "./config";

export interface IDeleteModalProps {
  handleClose: () => void;
  handleDelete?: () => void;
}

export function DeleteModal(props: IDeleteModalProps) {
  const { handleClose, handleDelete = () => {} } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  return (
    <BaseModal
      title={DeleteData.title}
      nextButton={DeleteData.delate}
      backButton={DeleteData.cancel}
      handleNext={handleDelete}
      handleClose={handleClose}
      initialDivider={false}
      width={isMobile ? "287px" : "402px"}
    >
      <Text>{DeleteData.data}</Text>
    </BaseModal>
  );
}
