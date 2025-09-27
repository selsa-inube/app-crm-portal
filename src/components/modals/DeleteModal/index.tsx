import { Icon, Text, useMediaQuery } from "@inubekit/inubekit";
import { useState } from "react";
import { MdOutlineInfo } from "react-icons/md";

import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";
import { BaseModal } from "@components/modals/baseModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";

import { DeleteData } from "./config";

export interface IDeleteModalProps {
  handleClose: () => void;
  handleDelete?: () => void;
  TextDelete: string;
}

export function DeleteModal(props: IDeleteModalProps) {
  const { handleClose, handleDelete = () => {}, TextDelete } = props;

  const isMobile = useMediaQuery("(max-width:880px)");
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <BaseModal
      title={DeleteData.title}
      nextButton={DeleteData.delate}
      backButton={DeleteData.cancel}
      handleNext={handleDelete}
      disabledNext={canEditCreditRequest}
      handleClose={handleClose}
      initialDivider={false}
      iconBeforeNext={
        canEditCreditRequest ? (
          <Icon
            icon={<MdOutlineInfo />}
            appearance="primary"
            size="16px"
            cursorHover
            onClick={handleInfo}
          />
        ) : undefined
      }
      width={isMobile ? "287px" : "402px"}
    >
      <Text>{TextDelete}</Text>
      {isModalOpen ? (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrm.title}
          subtitle={privilegeCrm.subtitle}
          description={privilegeCrm.description}
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      ) : (
        <></>
      )}
    </BaseModal>
  );
}
