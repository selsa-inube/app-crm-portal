import { MdWarningAmber, MdClear } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { AlertContainer, StyledPrint } from "./styles";
import { messages } from "./config";

export interface ErrorAlertProps {
  message?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

const ErrorAlert = (props: ErrorAlertProps) => {
  const { message, onClose, isMobile } = props;

  return (
    <StyledPrint>
      <AlertContainer $isMobile={isMobile}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          gap="20px"
          width="100%"
        >
          <Icon appearance="warning" icon={<MdWarningAmber />} size="24px" />
          <Stack justifyContent="center">
            <Text>{message || messages.defaultError}</Text>
          </Stack>

          <Icon
            appearance="dark"
            icon={<MdClear />}
            size="16px"
            cursorHover
            onClick={onClose}
          />
        </Stack>
      </AlertContainer>
    </StyledPrint>
  );
};

export { ErrorAlert };
