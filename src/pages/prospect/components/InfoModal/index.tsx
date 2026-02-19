import { BaseModal } from "@components/modals/baseModal";
import { Stack, Text } from "@inubekit/inubekit";
import { ReactNode } from "react";

interface InfoModalProps {
  onClose: () => void;
  onNext?: () => void;
  title: string;
  subtitle: string;
  description: ReactNode | string;
  nextButtonText?: string;
  width?: string;
  isMobile?: boolean;
}

function InfoModal({
  onClose,
  onNext,
  title,
  subtitle,
  description,
  nextButtonText = infoModalConfig.nextButtonText.i18n.es,
  width,
  isMobile = false,
}: InfoModalProps) {
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
          {typeof description === "string" ? (
            <Text weight="normal" size="medium" appearance="gray">
              {description}
            </Text>
          ) : (
            description
          )}
        </Text>
      </Stack>
    </BaseModal>
  );
}

export default InfoModal;
