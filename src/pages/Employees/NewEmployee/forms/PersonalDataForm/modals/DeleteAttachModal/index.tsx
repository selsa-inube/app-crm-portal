import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import { Icon, Stack, Text, useMediaQuery, Blanket, Divider, Button } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

import { StyledModal, StyledContainerClose } from "./styles";

export interface DeleteAttachModalProps {
  portalId?: string;
  onCloseModal?: () => void;
  onDelete?: () => void;
}

export function DeleteAttachModal(props: DeleteAttachModalProps) {
  const { portalId = "portal", onCloseModal, onDelete } = props;

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
            Eliminar
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap={spacing.s100}>
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <Text size="medium">¿Realmente quieres eliminar el archivo adjunto?</Text>
        <Stack justifyContent="flex-end" gap={spacing.s250}>
          <Button onClick={onCloseModal} appearance="gray" variant="outlined">
            Cerrar
          </Button>
          <Button onClick={onDelete} appearance="danger">
            Eliminar
          </Button>
        </Stack>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
