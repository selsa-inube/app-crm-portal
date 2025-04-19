import { Stack, Text, Divider } from "@inubekit/inubekit";
import { spacing } from "@design/tokens/spacing";

import { StyledAssignmentCard } from "./styles";

interface AssignmentCardProps {
  title: string;
  assignment: string;
  value: string;
  isMobile: boolean;
}

function AssignmentCard(props: AssignmentCardProps) {
  const { title, assignment, value, isMobile = false } = props;

  return (
    <StyledAssignmentCard $isMobile={isMobile}>
      <Stack direction="column" alignItems="center" gap={spacing.s150}>
        <Text type="label" weight="bold" appearance="primary">
          {title}
        </Text>
        <Divider dashed />
        <Stack direction="column" alignItems="flex-start" width="100%" gap={spacing.s150}>
          <Stack direction="column" gap={spacing.s050}>
            <Text type="label" weight="bold" size="medium">
              Asignación
            </Text>
            <Text size="medium" appearance="gray">
              {assignment}
            </Text>
          </Stack>
          <Stack direction="column" gap={spacing.s050}>
            <Text type="label" weight="bold" size="medium">
              Valor
            </Text>
            <Text size="medium" appearance="gray">
              {value}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </StyledAssignmentCard>
  );
}

export { AssignmentCard };
export type { AssignmentCardProps };
