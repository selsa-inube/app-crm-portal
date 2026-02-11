import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdOutlineManageAccounts,
  MdOutlineCached,
} from "react-icons/md";
import { Stack, Icon, Text, useMediaQuery, Button } from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { initialCustomerData } from "@context/CustomerContext/types";
import { useEnum } from "@hooks/useEnum/useEnum";

import { StyledContainerGeneralHeader, StyledPerfil } from "./styles";
import { appearanceTag, tittleHeader } from "./config";

interface IGeneralHeaderProps {
  profileImageUrl: string;
  name: string;
  descriptionStatus?: string;
  iconSettings?: React.ReactNode;
  iconButton?: React.ReactNode;
  buttonText?: string;
  showButton?: boolean;
  showIcon?: boolean;
  onClickIcon?: () => void;
  onClickButton?: () => void;
}

export function GeneralHeader(props: IGeneralHeaderProps) {
  const {
    profileImageUrl,
    name,
    descriptionStatus,
    buttonText,
    showButton,
    showIcon,
    onClickIcon,
    onClickButton,
  } = props;

  const { setCustomerPublicCodeState, setCustomerData } =
    useContext(CustomerContext);
  const isMobile = useMediaQuery("(max-width: 460px)");
  const navigate = useNavigate();
  const { lang } = useEnum();
  return (
    <StyledContainerGeneralHeader>
      <Stack
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        padding="6px "
        direction={!isMobile ? "row" : "column"}
      >
        <Stack
          gap="12px"
          alignItems="center"
          width="100%"
          justifyContent={isMobile ? "space-between" : "start"}
        >
          <Stack gap="12px">
            <StyledPerfil src={profileImageUrl} alt="imagen perfil" />
            <Stack direction="column" justifyContent="space-around">
              <Text type="label" size="medium" appearance="dark" weight="bold">
                {name}
              </Text>
              <Stack direction="row" alignItems="center" gap="6px">
                <Text
                  type="label"
                  size="small"
                  appearance="gray"
                  weight="normal"
                >
                  {tittleHeader.title.i18n[lang]}
                </Text>
                <Icon
                  size="12px"
                  icon={appearanceTag(descriptionStatus).icon}
                  appearance={appearanceTag(descriptionStatus).appearance}
                  spacing="narrow"
                />
                <Text
                  type="label"
                  size="small"
                  appearance={appearanceTag(descriptionStatus).appearance}
                  weight="normal"
                >
                  {descriptionStatus}
                </Text>
              </Stack>
            </Stack>
            <Stack height="100%" margin="auto 0">
              <Icon
                icon={<MdOutlineCached />}
                appearance="primary"
                variant="outlined"
                size="20px"
                cursorHover
                onClick={() => {
                  setCustomerPublicCodeState("");
                  setCustomerData(initialCustomerData);
                  navigate("/clients/select-client/");
                }}
              />
            </Stack>
          </Stack>
          {showIcon && (
            <Icon
              onClick={onClickIcon}
              appearance="primary"
              icon={<MdOutlineManageAccounts />}
              cursorHover
              spacing="narrow"
              variant="outlined"
              shape="rectangle"
              size="22px"
            />
          )}
        </Stack>
        {showButton && (
          <Stack
            justifyContent="space-between"
            alignItems="end"
            padding={isMobile ? "6px 0px 0px 0px" : "0 6px"}
            width={isMobile ? "100%" : "auto"}
          >
            <Button
              onClick={onClickButton}
              iconBefore={<MdAdd />}
              variant="outlined"
              appearance="primary"
              spacing="compact"
              fullwidth={isMobile}
            >
              {buttonText}
            </Button>
          </Stack>
        )}
      </Stack>
    </StyledContainerGeneralHeader>
  );
}
