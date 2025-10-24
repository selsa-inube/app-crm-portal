import { MdClose } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { StyledMenu, StyledMenuItem } from "./styles";

interface MobileMenuProps {
  onClose: () => void;
  onAttach: () => void;
  onViewAttachments: () => void;
  onGuarantee: () => void;
}

function MobileMenu(props: MobileMenuProps) {
  const { onClose, onAttach, onViewAttachments, onGuarantee } = props;

  return (
    <StyledMenu>
      <Stack justifyContent="space-between" alignItems="center">
        <Text appearance="dark" size="small" type="headline">
          Menú
        </Text>
        <Icon
          icon={<MdClose />}
          appearance="dark"
          size="24px"
          onClick={onClose}
        />
      </Stack>
      <StyledMenuItem>
        <Text appearance="dark" size="medium" type="body">
          Imprimir
        </Text>
      </StyledMenuItem>
      <StyledMenuItem onClick={onAttach}>
        <Text appearance="dark" size="medium" type="body">
          Adjuntar
        </Text>
      </StyledMenuItem>
      <StyledMenuItem onClick={onViewAttachments}>
        <Text appearance="dark" size="medium" type="body">
          Ver Adjuntos
        </Text>
      </StyledMenuItem>
      <StyledMenuItem onClick={onGuarantee}>
        <Text appearance="dark" size="medium" type="body">
          Garantías ofrecidas
        </Text>
      </StyledMenuItem>
    </StyledMenu>
  );
}

export { MobileMenu };
export type { MobileMenuProps };
