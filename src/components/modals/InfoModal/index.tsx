import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import { Icon, Text, Stack, Divider, Button, Blanket, useMediaQuery } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

import { StyledModal, StyledContainerClose } from "./styles";

export interface InfoModalProps {
  buttonText?: string;
  description?: string;
  titleDescription?: string;
  title?: string;
  portalId?: string;
  onCloseModal?: () => void;
}

export function InfoModal(props: InfoModalProps) {
  const {
    buttonText = "Entendido",
    description = "Descripcion por defecto",
    titleDescription = "Titulo de la descripcion",
    title = "Información",
    portalId = "portal",
    onCloseModal,
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
        <Text>{titleDescription}</Text>
        <Text size="medium" appearance="gray">
          {description}
        </Text>
        <Stack justifyContent="end">
          <Button onClick={onCloseModal} fullwidth={isMobile} cursorHover>
            {buttonText}
          </Button>
        </Stack>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
