import { Stack, Icon, Text, Grid } from "@inubekit/inubekit";

import { IconText } from "@pages/prospect/components/IconText";
import { truncateTextToMaxLength } from "@utils/formatData/text";

import { StyledMoneyDestinationCard, StyledRadio } from "./styles";

interface MoneyDestinationCardProps {
  id: string;
  name: string;
  value: string;
  label: string;
  icon: string;
  isSelected: boolean;
  isMobile?: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

function MoneyDestinationCard(props: MoneyDestinationCardProps) {
  const { id, name, value, label, icon, isSelected, isMobile, handleChange } =
    props;

  const maxLength = isMobile ? 30 : 50;

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
          <Text size="medium">{truncateTextToMaxLength(label, maxLength)}</Text>
        </Stack>
      </Grid>
    </StyledMoneyDestinationCard>
  );
}

export { MoneyDestinationCard };
export type { MoneyDestinationCardProps };
