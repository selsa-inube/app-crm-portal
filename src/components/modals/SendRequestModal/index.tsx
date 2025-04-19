import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import { Text, Icon, Stack, Button, Blanket, Divider, useMediaQuery } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

import { StyledModal, StyledContainerClose } from "./styles";

export interface SendRequestModalProps {
  descriptionText: string;
  buttonText?: string;
  title?: string;
  portalId?: string;
  secondaryButtonText?: string;
  onCloseModal?: () => void;
  onSubmitButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
}

export function SendRequestModal(props: SendRequestModalProps) {
  const {
    descriptionText,
    buttonText = "Enviar",
    title = "Enviar solicitud",
    portalId = "portal",
    secondaryButtonText = "Cancelar",
    onCloseModal,
    onSubmitButtonClick,
    onSecondaryButtonClick,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const portalNode = document.getElementById(portalId);

  if (!portalNode) {
    throw new Error("The portal node is not defined. Ensure the specific node exists in the DOM.");
  }

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small">
            {title}
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap={spacing.s100}>
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <Text>{descriptionText}</Text>
        <Stack justifyContent="end" gap={spacing.s250}>
          <Button
            type="button"
            variant="outlined"
            appearance="gray"
            onClick={onSecondaryButtonClick}
          >
            {secondaryButtonText}
          </Button>
          <Button onClick={onSubmitButtonClick}>{buttonText}</Button>
        </Stack>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
