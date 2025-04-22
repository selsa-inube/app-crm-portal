import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  Divider,
  Blanket,
  Button,
} from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";

import { StyledContainer, StyledContainerClose } from "./styles";
import { dataBaseModal } from "./config";

export interface IBaseModalProps {
  handleNext: () => void;
  title: string;
  nextButton: string;
  children: JSX.Element | JSX.Element[];
  handleBack?: () => void;
  handleClose?: () => void;
  width?: string;
  height?: string;
  disabledNext?: boolean;
  disabledBack?: boolean;
  iconBeforeNext?: React.JSX.Element;
  iconAfterNext?: React.JSX.Element;
  iconBeforeback?: React.JSX.Element;
  iconAfterback?: React.JSX.Element;
  backButton?: string;
  initialDivider?: boolean;
  finalDivider?: boolean;
  portalId?: string;
}

export function BaseModal(props: IBaseModalProps) {
  const {
    handleNext,
    title,
    nextButton,
    children,
    handleBack,
    handleClose,
    width = "",
    height = "",
    disabledNext = false,
    disabledBack = false,
    iconBeforeNext,
    iconAfterNext,
    iconBeforeback,
    iconAfterback,
    backButton = "",
    initialDivider = true,
    finalDivider = false,
    portalId = "portal",
  } = props;

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }

  return createPortal(
    <Blanket>
      <StyledContainer>
        <Stack
          direction="column"
          padding="24px"
          gap="24px"
          width={width}
          height={height}
        >
          <Stack justifyContent="space-between" alignItems="center">
            <Text size="small" type="headline">
              {title}
            </Text>
            <StyledContainerClose onClick={handleClose || handleBack}>
              <Stack alignItems="center" gap="8px">
                <Text type="body" size="large">
                  {dataBaseModal.close}
                </Text>
                <Icon
                  icon={<MdClear />}
                  size="24px"
                  cursorHover
                  appearance="dark"
                />
              </Stack>
            </StyledContainerClose>
          </Stack>
          {initialDivider && <Divider />}
          <Stack direction="column">{children}</Stack>
          {finalDivider && <Divider />}
          <Stack justifyContent="end" gap="20px">
            {backButton && (
              <Button
                onClick={handleBack || handleClose}
                disabled={disabledBack}
                variant="outlined"
                appearance="gray"
                iconAfter={iconAfterback}
                iconBefore={iconBeforeback}
              >
                {backButton}
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={disabledNext}
              iconAfter={iconAfterNext}
              iconBefore={iconBeforeNext}
            >
              {nextButton}
            </Button>
          </Stack>
        </Stack>
      </StyledContainer>
    </Blanket>,
    node,
  );
}
