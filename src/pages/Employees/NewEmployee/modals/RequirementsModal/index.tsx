import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import { Icon, Stack, Text, useMediaQuery, Blanket, Divider, Button } from "@inubekit/inubekit";

import { AlertCard, AlertCardProps } from "@components/data/AlertCard";
import { spacing } from "@design/tokens/spacing";

import { StyledModal, StyledContainerClose, StyledContainerCards } from "./styles";

export interface RequirementsModalProps {
  portalId?: string;
  alertCards: AlertCardProps[];
  onCloseModal?: () => void;
}

export function RequirementsModal(props: RequirementsModalProps) {
  const { portalId = "portal", alertCards, onCloseModal } = props;

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
            Requisitos
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap={spacing.s100}>
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <StyledContainerCards $smallScreen={isMobile}>
          {alertCards.map((item, index) => (
            <AlertCard
              key={index}
              icon={item.icon}
              iconAppearance={item.iconAppearance}
              requirement={item.requirement}
              cause={item.cause}
              ellipsis
            />
          ))}
        </StyledContainerCards>
        <Divider />
        <Stack direction="column" alignItems="flex-end">
          <Button onClick={onCloseModal} fullwidth={isMobile}>
            Cerrar
          </Button>
        </Stack>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
