import { Text, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { EnumType } from "@hooks/useEnum/useEnum";

import { DeleteData } from "./config";

export interface IDeleteModalProps {
  handleClose: () => void;
  handleDelete?: () => void;
  TextDelete: string;
  lang: EnumType;
  isLoading?: boolean;
}

export function DeleteModal(props: IDeleteModalProps) {
  const {
    handleClose,
    handleDelete = () => {},
    TextDelete,
    lang,
    isLoading = false,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  return (
    <BaseModal
      title={DeleteData.title.i18n[lang]}
      nextButton={DeleteData.delete.i18n[lang]}
      backButton={DeleteData.cancel.i18n[lang]}
      handleNext={handleDelete}
      handleClose={handleClose}
      initialDivider={false}
      width={isMobile ? "287px" : "402px"}
      isLoading={isLoading}
    >
      <Text>{TextDelete}</Text>
    </BaseModal>
  );
}
