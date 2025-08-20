import { Stack, Icon, Text, Grid } from "@inubekit/inubekit";

import { IconText } from "@pages/prospect/components/IconText";

import { StyledMoneyDestinationCard, StyledRadio } from "./styles";

interface MoneyDestinationCardProps {
  id: string;
  name: string;
  value: string;
  label: string;
  icon: string;
  isSelected: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

function MoneyDestinationCard(props: MoneyDestinationCardProps) {
  const { id, name, value, label, icon, isSelected, handleChange } = props;

  return (
    <StyledMoneyDestinationCard>
      <Grid
        templateColumns="auto 1fr"
        padding="16px 24px"
        height="72px"
        alignItems="center"
        alignContent="center"
        gap="14px"
      >
        <StyledRadio
          type="radio"
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          checked={isSelected}
        />
        <Stack gap="12px">
          <Icon appearance="dark" icon={<IconText icon={icon} />} size="20px" />
          <Text size="medium">{label}</Text>
        </Stack>
      </Grid>
    </StyledMoneyDestinationCard>
  );
}

export { MoneyDestinationCard };
export type { MoneyDestinationCardProps };
