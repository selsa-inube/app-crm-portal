import { useState } from "react";
import { Stack, Icon, useMediaQuery } from "@inubekit/inubekit";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrm } from "@config/privilege";

import { icons } from "./config";
import InfoModal from "../../InfoModal";

interface IDetailprops {
  handleDelete: () => void;
  handleEdit: () => void;
}

export function Detail(props: IDetailprops) {
  const { handleDelete, handleEdit } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const isMobile = useMediaQuery("(max-width:880px)");
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Stack justifyContent="space-around">
      {icons.map((item, index) => (
        <Icon
          key={index}
          icon={item.icon}
          size="16px"
          cursorHover
          appearance={item.appearance}
          onClick={() => {
            if (item.id === "delete") {
              canEditCreditRequest ? handleInfo() : handleDelete();
            } else if (item.id === "edit") {
              canEditCreditRequest ? handleInfo() : handleEdit();
            }
          }}
        />
      ))}
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
    </Stack>
  );
}
