import { Icon, Stack, Text } from "@inubekit/inubekit";
import { MdClear } from "react-icons/md";

import { BaseModal } from "../baseModal";
import { errorModalConfig } from "./config";

interface IErrorModalProps {
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
}

export function ErrorModal(props: IErrorModalProps) {
  const { isMobile, message, handleClose } = props;

  return (
    <BaseModal
      title={errorModalConfig.title}
      nextButton={errorModalConfig.understand}
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
          {errorModalConfig.sorry}
        </Text>
        <Text type="body" size="large" appearance="gray">
          {message}
        </Text>
      </Stack>
    </BaseModal>
  );
}
