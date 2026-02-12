import { Icon, Stack, Text } from "@inubekit/inubekit";
import { MdClear } from "react-icons/md";

import { useEnum } from "@hooks/useEnum/useEnum";

import { BaseModal } from "../baseModal";
import { errorModalConfig } from "./config";
import { StyledText } from "./styles";

interface IErrorModalProps {
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
}

export function ErrorModal(props: IErrorModalProps) {
  const { isMobile, message, handleClose } = props;

  const { lang } = useEnum();

  return (
    <BaseModal
      title={errorModalConfig.title.i18n[lang]}
      nextButton={errorModalConfig.understand.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px" : "450px"}
    >
      <Stack direction="column" gap="16px" alignItems="center">
        <Icon
          icon={<MdClear />}
          appearance="danger"
          variant="filled"
          shape="circle"
          spacing="compact"
          size="68px"
        />
        <Text type="body" size="large" weight="bold">
          {errorModalConfig.sorry.i18n[lang]}
        </Text>
        <StyledText>
          <Text type="body" size="large" appearance="gray">
            {message}
          </Text>
        </StyledText>
      </Stack>
    </BaseModal>
  );
}
