import { Stack, Icon, Text } from "@inubekit/inubekit";

import {
  StyledMenu,
  StyledContainerLabel,
  StyledAnchor,
  StyleBadgeMenuProspect,
} from "./styles";
import { IOptions } from "./types";

interface MenuProspectProps {
  options: IOptions[];
  isMobile?: boolean;
  badges?: Record<string, number>;
  hasExtraordinaryInstallments?: boolean;
  onMouseLeave?: () => void;
  only?: boolean;
}

export const MenuProspect = (props: MenuProspectProps) => {
  const {
    options,
    onMouseLeave,
    only,
    badges,
    isMobile,
    hasExtraordinaryInstallments,
  } = props;

  const shouldShowOption = (option: IOptions) => {
    if (option.id === "extraPayments" && hasExtraordinaryInstallments) {
      return false;
    }
    return option.visible;
  };

  return (
    <Stack>
      {only && (
        <Stack>
          {options &&
            options.map(
              (option, index) =>
                shouldShowOption(option) && (
                  <>
                    <StyledAnchor key={index} title={option.title}>
                      <StyledContainerLabel
                        onClick={option.onClick}
                        $only={only}
                      >
                        <Icon
                          icon={option.icon}
                          appearance="primary"
                          size="24px"
                        ></Icon>
                      </StyledContainerLabel>
                    </StyledAnchor>

                    {badges && badges[option.id as string] > 0 && (
                      <StyleBadgeMenuProspect
                        $data={badges[option.id as string]}
                        isMobile={isMobile || false}
                      />
                    )}
                  </>
                ),
            )}
        </Stack>
      )}
      {!only && (
        <StyledMenu onMouseLeave={onMouseLeave}>
          {options &&
            options.map(
              (option, index) =>
                shouldShowOption(option) && (
                  <StyledContainerLabel key={index} onClick={option.onClick}>
                    <Icon
                      icon={option.icon}
                      appearance="primary"
                      size="24px"
                    ></Icon>
                    <Text size="small" weight="normal">
                      {option.title}
                    </Text>
                  </StyledContainerLabel>
                ),
            )}
        </StyledMenu>
      )}
    </Stack>
  );
};
export type { MenuProspectProps };
