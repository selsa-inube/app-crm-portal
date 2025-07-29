import { Icon, Stack, Text } from "@inubekit/inubekit";
import { FC, ReactNode } from "react";
import { StyledCreditCard } from "./styles";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
  url?: string;
  width?: string;
  isDisabled?: boolean;
}

export const CreditCard: FC<Props> = ({
  icon,
  title,
  subtitle,
  url,
  width,
  isDisabled = false,
}) => (
  <StyledCreditCard to={url ?? ""} $width={width} $isDisabled={isDisabled}>
    <Stack
      direction="column"
      width={width ?? "194px"}
      alignItems="center"
      gap="12px"
    >
      <Icon appearance="dark" icon={icon} size="30px" />
      <Stack direction="column" alignItems="center" gap="4px">
        <Text type="title" size="medium" weight="bold">
          {title}
        </Text>
        <Text type="title" size="small" appearance="gray" textAlign="center">
          {subtitle}
        </Text>
      </Stack>
    </Stack>
  </StyledCreditCard>
);
