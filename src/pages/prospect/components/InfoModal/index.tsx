import { BaseModal } from "@components/modals/baseModal";
import { Stack, Text } from "@inubekit/inubekit";
import React from "react";

interface InfoModalProps {
  onClose: () => void;
  onNext?: () => void;
  title: string;
  subtitle: string;
  description: string;
  nextButtonText?: string;
  width?: string;
  isMobile?: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({
  onClose,
  onNext,
  title,
  subtitle,
  description,
  nextButtonText = "Continuar",
  width,
  isMobile = false,
}) => {
  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const modalWidth = width || (isMobile ? "290px" : "400px");

  return (
    <BaseModal
      title={title}
      nextButton={nextButtonText}
      handleNext={handleNext}
      handleClose={onClose}
      width={modalWidth}
    >
      <Stack gap="16px" direction="column">
        <Text weight="bold" size="large">
          {subtitle}
        </Text>
        <Text weight="normal" size="medium" appearance="gray">
          {description}
        </Text>
      </Stack>
    </BaseModal>
  );
};

export default InfoModal;
