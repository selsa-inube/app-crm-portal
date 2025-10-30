import { Stack, Icon, Text } from "@inubekit/inubekit";

import { StyledMenu, StyledContainerLabel, StyledA } from "./styles";
import { IOptions } from "./types";

interface MenuProspectProps {
  options: IOptions[];
  onMouseLeave?: () => void;
  only?: boolean;
}

export const MenuProspect = (props: MenuProspectProps) => {
  const { options, onMouseLeave, only } = props;

  return (
    <Stack>
      {only && (
        <Stack>
          {options &&
            options.map(
              (option, index) =>
                option.visible && (
                  <StyledA key={index} title={option.title}>
                    <StyledContainerLabel onClick={option.onClick} $only={only}>
                      <Icon
                        icon={option.icon}
                        appearance="primary"
                        size="24px"
                      ></Icon>
                    </StyledContainerLabel>
                  </StyledA>
                ),
            )}
        </Stack>
      )}
      {!only && (
        <StyledMenu onMouseLeave={onMouseLeave}>
          {options &&
            options.map(
              (option, index) =>
                option.visible && (
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
