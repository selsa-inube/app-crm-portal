import {
  SkeletonIcon,
  SkeletonLine,
  Stack,
  Text,
  Icon,
  useMediaQuery,
  Divider,
} from "@inubekit/inubekit";
import { StyledInteractiveBox } from "./styles";

interface IInteractiveBox {
  description?: string;
  icon?: React.ReactNode;
  label?: string;
  url?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const InteractiveBox = ({
  label,
  description,
  icon,
  url,
  isLoading,
  isDisabled,
}: IInteractiveBox) => {
  const screenMobile = useMediaQuery("(max-width: 400px)");
  if (isLoading) {
    return (
      <StyledInteractiveBox to={url ?? ""} $isMobile={screenMobile}>
        <Stack direction="column" gap={"16px"}>
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
    );
  }
  return (
    <StyledInteractiveBox
      to={url ?? ""}
      $isMobile={screenMobile}
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
  );
};

export { InteractiveBox };
export type { IInteractiveBox };
