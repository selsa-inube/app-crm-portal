import { MdClose } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { StyledContainer, StyledLi, StyledUl, StyledActions } from "./styles";
import { Actions } from "./config";

interface ActionModalProps {
  onClose: () => void;
  onClickDetails?: () => void;
  onClickEdit?: () => void;
  onClickEliminate?: () => void;
}

export function ActionModal(props: ActionModalProps) {
  const { onClose, onClickDetails, onClickEdit, onClickEliminate } = props;

  const actionsLi = Actions(onClickDetails, onClickEdit, onClickEliminate);
  return (
    <StyledContainer>
      <StyledActions>
        <Stack padding="10px 15px" width="132px">
          <Icon
            icon={<MdClose />}
            appearance="dark"
            size="24px"
            onClick={onClose}
            cursorHover
          />
          <StyledUl>
            {actionsLi.map((item, index) => (
              <StyledLi key={index} onClick={item.onClick}>
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
