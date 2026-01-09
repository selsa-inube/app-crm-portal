import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";

import {
  Stack,
  Icon,
  Text,
  Divider,
  Button,
  Blanket,
} from "@inubekit/inubekit";
import { useEnum } from "@hooks/useEnum/useEnum";

import { StyledContainer, StyledContainerClose } from "./styles";
import { dataBaseModal } from "./config";

export interface IBaseModalProps {
  title: string | React.ReactNode;
  children: JSX.Element | JSX.Element[];
  handleNext?: () => void;
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
  apparenceNext?: Appearance;
  variantNext?: Variant;
  nextButton?: string;
  backButton?: string;
  initialDivider?: boolean;
  finalDivider?: boolean;
  portalId?: string;
  isLoading?: boolean;
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
    apparenceNext = "primary",
    variantNext = "filled",
    backButton = "",
    initialDivider = true,
    finalDivider = false,
    portalId = "portal",
    isLoading = false,
  } = props;

  const { lang } = useEnum();

  function getOrCreatePortalNode(id: string): HTMLElement {
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement("div");
      node.id = id;
      document.body.appendChild(node);
    }
    return node;
  }

  const node = getOrCreatePortalNode(portalId ?? "portal");
  node.style.position = "relative";
  node.style.zIndex = "3";

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
                  {dataBaseModal.close.i18n[lang]}
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

            {nextButton && (
              <Button
                onClick={handleNext}
                disabled={disabledNext}
                iconAfter={iconAfterNext}
                iconBefore={iconBeforeNext}
                appearance={apparenceNext}
                variant={variantNext}
                loading={isLoading}
              >
                {nextButton}
              </Button>
            )}
          </Stack>
        </Stack>
      </StyledContainer>
    </Blanket>,
    node,
  );
}
