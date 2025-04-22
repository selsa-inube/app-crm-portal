import {
  MdAdd,
  MdCheckCircle,
  MdOutlineAccessTime,
  MdCancel,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { Stack, Icon, Text, useMediaQuery } from "@inubekit/inubekit";
import { Button } from "@inubekit/button";

import { StyledContainerGeneralHeader, StyledPerfil } from "./styles";

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

type AppearanceType =
  | "success"
  | "danger"
  | "primary"
  | "warning"
  | "help"
  | "dark"
  | "gray"
  | "light";

export function GeneralHeader(props: IGeneralHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 460px)");

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

  const appearanceTag = (label: string = "") => {
    const config: Record<
      string,
      { appearance: AppearanceType; icon: JSX.Element }
    > = {
      Activo: { appearance: "success", icon: <MdCheckCircle /> },
      Vinculado: { appearance: "success", icon: <MdCheckCircle /> },
      Inactivo: { appearance: "warning", icon: <MdCheckCircle /> },
      "En proceso devinculación": {
        appearance: "warning",
        icon: <MdOutlineAccessTime />,
      },
      "En proceso de retiro": { appearance: "danger", icon: <MdCancel /> },
      Retirado: { appearance: "danger", icon: <MdCancel /> },
    };
    return config[label] || { appearance: "danger", icon: "" };
  };

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
