import {
  SkeletonIcon,
  SkeletonLine,
  Stack,
  Text,
  Icon,
  Divider,
} from "@inubekit/inubekit";

import { StyledInteractiveBox } from "./styles";

export interface IInteractiveBox {
  isMobile: boolean;
  description?: string;
  icon?: React.ReactNode;
  label?: string;
  url?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function InteractiveBox(props: IInteractiveBox) {
  const { isMobile, label, description, icon, url, isLoading, isDisabled } =
    props;

  return (
    <>
      {isLoading ? (
        <StyledInteractiveBox to={url ?? ""} $isMobile={isMobile}>
          <Stack direction="column" gap="16px">
            <Stack width="70%">
              <SkeletonLine animated />
            </Stack>
            <Stack width="100%">
              <SkeletonLine animated />
            </Stack>
          </Stack>
          <Stack justifyContent="flex-end">
            <SkeletonIcon animated />
          </Stack>
        </StyledInteractiveBox>
      ) : (
        <StyledInteractiveBox
          to={url ?? ""}
          $isMobile={isMobile}
          $isDisabled={isDisabled}
        >
          <Stack direction="column" gap="16px">
            <Stack justifyContent="space-between">
              <Text type="title" size="medium" weight="bold">
                {label}
              </Text>
              <Stack justifyContent="flex-end">
                <Icon icon={icon} appearance="dark" size="24px" cursorHover />
              </Stack>
            </Stack>
            <Divider dashed />
            <Text type="body" size="small">
              {description}
            </Text>
          </Stack>
        </StyledInteractiveBox>
      )}
    </>
  );
}
