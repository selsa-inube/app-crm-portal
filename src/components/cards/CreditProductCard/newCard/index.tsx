import { MdOutlineAdd } from "react-icons/md";
import { useState } from "react";
import { Stack, Icon, Text, useMediaQuery } from "@inubekit/inubekit";

import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";

import { dataNewCard } from "./config";
import { StyledCreditProductCard } from "../styles";

interface INewCreditProductCardProps {
  onClick: () => void;
}

export function NewCreditProductCard(props: INewCreditProductCardProps) {
  const { onClick } = props;
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:880px)");
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Stack gap="6px">
      <StyledCreditProductCard
        onClick={() => (canEditCreditRequest ? handleInfo() : onClick())}
        $new={true}
        $showIcons={true}
      >
        <Stack direction="column" alignItems="center" margin="auto">
          <Icon icon={<MdOutlineAdd />} appearance="gray" size="45px" />
          <Text type="body" size="large" appearance="gray">
            {dataNewCard.add}
          </Text>
        </Stack>
      </StyledCreditProductCard>
      {isModalOpen && (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrm.title}
          subtitle={privilegeCrm.subtitle}
          description={privilegeCrm.description}
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      )}
    </Stack>
  );
}
