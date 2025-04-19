import { Stack, Text, Icon, Divider, IIconAppearance } from "@inubekit/inubekit";
import { spacing } from "@design/tokens/spacing";

import { StyledAlertCard } from "./styles";

interface AlertCardProps {
  requirement: string;
  cause: string;
  icon: React.ReactNode;
  title?: string;
  iconAppearance?: IIconAppearance;
  ellipsis?: boolean;
}

function AlertCard(props: AlertCardProps) {
  const { requirement, cause, icon, title, iconAppearance = "warning", ellipsis = false } = props;

  return (
    <Stack direction="column">
      <Stack>
        {title && (
          <Text type="title" size="medium" weight="bold" appearance="gray">
            {title}
          </Text>
        )}
      </Stack>

      <StyledAlertCard>
        <Stack direction="column" gap={spacing.s100}>
          <Stack direction="row" alignItems="center" gap="4px" justifyContent="space-between">
            <Text type="body" size="large">
              Requisito:
            </Text>
            <Icon icon={icon} appearance={iconAppearance} size="20px" />
          </Stack>

          <Divider />

          <Text type="body" size="medium" appearance="gray" ellipsis={ellipsis}>
            {requirement}
          </Text>

          <Stack direction="column" gap={spacing.s050}>
            <Text type="body" size="large">
              Causa de incumplimiento:
            </Text>
            <Divider />
            <Text type="body" size="medium" appearance="gray" ellipsis={ellipsis}>
              {cause}
            </Text>
          </Stack>
        </Stack>
      </StyledAlertCard>
    </Stack>
  );
}

export { AlertCard };
export type { AlertCardProps };
