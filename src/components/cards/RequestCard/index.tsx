import { Stack, Text, Divider } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

import { StyledRequestCard, StyledTitle } from "./styles";

interface RequestCardProps {
  id: string;
  title: string;
  requestDate: string;
  responsible?: string;
  hasResponsible?: boolean;
}

const RequestCard = (props: RequestCardProps) => {
  const { id, title, requestDate, responsible = "Sin responsable", hasResponsible = false } = props;

  return (
    <Stack direction="column" width="280px">
      <StyledRequestCard>
        <StyledTitle>
          <Stack justifyContent="center" margin="0px 0px 10px">
            <Text
              type="label"
              size="small"
              appearance="primary"
              textAlign="center"
              weight="bold"
              padding={spacing.s050}
            >
              {title}
            </Text>
          </Stack>
        </StyledTitle>
        <Divider dashed />
        <Stack direction="column" gap={spacing.s100}>
          <Stack direction="column" gap={spacing.s050}>
            <Text type="title" weight="bold" size="small">
              ID.
            </Text>
            <Text size="medium" appearance="gray">
              {id}
            </Text>
          </Stack>
          <Stack direction="column" gap={spacing.s050}>
            <Text type="title" weight="bold" size="small">
              Fecha de solicitud
            </Text>
            <Text size="medium" appearance="gray">
              {requestDate}
            </Text>
          </Stack>
          <Stack direction="column" gap={spacing.s050}>
            <Text type="title" weight="bold" size="small">
              Responsable
            </Text>
            <Text size="medium" appearance="gray">
              {hasResponsible ? responsible : "Sin responsable"}
            </Text>
          </Stack>
        </Stack>
      </StyledRequestCard>
    </Stack>
  );
};

export { RequestCard };
export type { RequestCardProps };
