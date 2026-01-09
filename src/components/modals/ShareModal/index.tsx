import { Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "../baseModal";
import { shareModalConfig } from "./config";

interface IShareModalProps {
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
  handleNext?: () => void;
}

export function ShareModal(props: IShareModalProps) {
  const { isMobile, message, handleClose, handleNext } = props;

  return (
    <BaseModal
      title={shareModalConfig.title}
      nextButton={shareModalConfig.buttonText}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "300px" : "450px"}
    >
      <Stack direction="column" gap="16px" alignItems="center">
        <Text type="body" size="large" weight="bold">
          {shareModalConfig.understood}
        </Text>
        <Text type="body" size="large" appearance="gray">
          {message}
        </Text>
      </Stack>
    </BaseModal>
  );
}
