import {
  SkeletonIcon,
  SkeletonLine,
  Stack,
  Text,
  Icon,
  Divider,
} from "@inubekit/inubekit";

import { truncateTextToMaxLength } from "@utils/formatData/text";

import { StyledInteractiveBox } from "./styles";

export interface IInteractiveBox {
  isMobile: boolean;
  description?: string;
  icon?: React.ReactNode;
  label?: string;
  url?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onInvalidUrl?: () => void;
}

export function InteractiveBox(props: IInteractiveBox) {
  const { isMobile, label, description, icon, url, isLoading, isDisabled } =
    props;

  return (
    <>
      {isLoading ? (
        <StyledInteractiveBox
          to={url ?? ""}
          $isMobile={isMobile}
          onClick={(event: React.MouseEvent) => {
            if (!url) {
              event.preventDefault();
              props.onInvalidUrl && props.onInvalidUrl();
            }
          }}
        >
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
          onClick={(event: React.MouseEvent) => {
            if (!url) {
              event.preventDefault();
              props.onInvalidUrl && props.onInvalidUrl();
            }
          }}
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
            <Text type="body" size="small" weight="normal" appearance="gray">
              {truncateTextToMaxLength(description, 50)}
            </Text>
          </Stack>
        </StyledInteractiveBox>
      )}
    </>
  );
}
