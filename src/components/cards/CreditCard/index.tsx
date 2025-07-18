import { Icon, Stack, Text } from "@inubekit/inubekit";
import { FC, ReactNode } from "react";
import { StyledCreditCard } from "./styles";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  width?: string;
}

export const CreditCard: FC<Props> = ({
  icon,
  title,
  subtitle,
  onClick,
  width,
}) => (
  <StyledCreditCard onClick={onClick} $width={width}>
    <Stack
      direction="column"
      width={width ?? "194px"}
      alignItems="center"
      gap="12px"
    >
      <Icon appearance="dark" icon={icon} size="30px" />
      <Stack direction="column" alignItems="center" gap="4px">
        <Text type="title" size="medium">
          {title}
        </Text>
        <Text type="title" size="small" appearance="gray" textAlign="center">
          {subtitle}
        </Text>
      </Stack>
    </Stack>
  </StyledCreditCard>
);
