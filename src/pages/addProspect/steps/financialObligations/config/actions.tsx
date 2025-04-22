import {
  MdClose,
  MdDeleteOutline,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import {
  StyledContainer,
  StyledLi,
  StyledUl,
  StyledActions,
  StyledContainerClose,
} from "./styles";

interface Action {
  icon: React.ReactNode;
  appearance:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "help"
    | "dark"
    | "gray"
    | "light";
  label: string;
}

interface ActionModalProps {
  onClose?: () => void;
  onClick?: () => void;
}

const actions: Action[] = [
  {
    icon: <MdOutlineRemoveRedEye />,
    appearance: "dark",
    label: "Ver detalles",
  },
  { icon: <MdOutlineEdit />, appearance: "primary", label: "Editar" },
  { icon: <MdDeleteOutline />, appearance: "danger", label: "Eliminar" },
];

export function ActionModal({ onClose, onClick }: ActionModalProps) {
  return (
    <StyledContainer>
      <StyledActions>
        <Stack padding="10px 15px" width="132px">
          <StyledContainerClose>
            <Icon
              icon={<MdClose />}
              appearance="dark"
              size="24px"
              onClick={onClose}
            />
          </StyledContainerClose>
          <StyledUl>
            {actions.map((item, index) => (
              <StyledLi key={index} onClick={onClick}>
                <Icon icon={item.icon} appearance={item.appearance} />
                <Text size="medium">{item.label}</Text>
              </StyledLi>
            ))}
          </StyledUl>
        </Stack>
      </StyledActions>
    </StyledContainer>
  );
}
