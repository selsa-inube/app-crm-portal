import { MdOutlineChevronLeft, MdMenu, MdOutlineInfo } from "react-icons/md";
import { Stack, Icon, Button } from "@inubekit/inubekit";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";

import { configButtons } from "../config";
import { StyledHorizontalDivider, StyledPrint } from "./styled";
import { ICRMPortalData } from "@src/context/AppContext/types";

interface IActionButtons {
  buttons: {
    buttonPrint: {
      OnClick: () => void;
    };
  };
  buttonsOutlined: {
    buttonViewAttachments: {
      OnClick: () => void;
    };
    buttonWarranty: {
      OnClick: () => void;
    };
  };
  menuIcon: () => void;
}

interface IStockTrayProps {
  navigation: () => void;
  eventData?: ICRMPortalData;
  isMobile?: boolean;
  actionButtons?: IActionButtons;
}

export const StockTray = (props: IStockTrayProps) => {
  const { navigation, isMobile, actionButtons } = props;

  const { disabledButton: canReject } = useValidateUseCase({
    useCase: getUseCaseValue("canReject"),
  });
  const { disabledButton: canCancel } = useValidateUseCase({
    useCase: getUseCaseValue("canCancel"),
  });

  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  return (
    <Stack
      justifyContent="space-between"
      alignItems="start"
      margin={isMobile ? "0px 0px 16px" : "0px 0px 16px"}
    >
      <StyledPrint>
        <Button
          spacing="compact"
          variant="outlined"
          iconBefore={<MdOutlineChevronLeft />}
          onClick={navigation}
        >
          Volver
        </Button>
      </StyledPrint>
      {isMobile && (
        <Icon
          icon={<MdMenu />}
          appearance="dark"
          size="32px"
          spacing="narrow"
          onClick={actionButtons?.menuIcon}
        />
      )}

      {!isMobile && (
        <StyledPrint>
          <Stack
            justifyContent="end"
            gap="16px"
            margin={!isMobile ? "0px 0px 16px 0px" : "0px"}
          >
            <Stack gap="16px">
              <Stack gap="2px" alignItems="center">
                {canReject && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                  />
                )}
              </Stack>
              <Stack gap="2px" alignItems="center">
                {canCancel && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                  />
                )}
              </Stack>
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  onClick={actionButtons?.buttons.buttonPrint.OnClick}
                >
                  {configButtons.buttons.buttonPrint.label}
                </Button>
              </Stack>
            </Stack>
            <StyledHorizontalDivider />
            <Stack gap="16px">
              <Stack gap="2px" alignItems="center">
                {editCreditApplication && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                  />
                )}
              </Stack>
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  onClick={
                    actionButtons?.buttonsOutlined.buttonViewAttachments.OnClick
                  }
                >
                  {configButtons.buttonsOutlined.buttonViewAttachments.label}
                </Button>
              </Stack>
              <StyledHorizontalDivider />
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  onClick={
                    actionButtons?.buttonsOutlined.buttonWarranty.OnClick
                  }
                >
                  {configButtons.buttonsOutlined.buttonWarranty.label}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </StyledPrint>
      )}
    </Stack>
  );
};
