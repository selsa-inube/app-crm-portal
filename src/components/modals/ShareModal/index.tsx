import { Stack, Text } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum/useEnum";

import { BaseModal } from "../baseModal";
import { shareModalConfig } from "./config";

interface IShareModalProps {
  lang: EnumType;
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
  handleNext?: () => void;
}

export function ShareModal(props: IShareModalProps) {
  const { lang, isMobile, message, handleClose, handleNext } = props;

  return (
    <BaseModal
      title={shareModalConfig.title.i18n[lang]}
      nextButton={shareModalConfig.buttonText.i18n[lang]}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "300px" : "450px"}
    >
      <Stack direction="column" gap="16px" alignItems="center">
        <Text type="body" size="large" weight="bold">
          {shareModalConfig.understood.i18n[lang]}
        </Text>
        <Text type="body" size="large" appearance="gray">
          {message}
        </Text>
      </Stack>
    </BaseModal>
  );
}
