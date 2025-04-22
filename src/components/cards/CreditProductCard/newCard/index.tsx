import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { dataNewCard } from "./config";
import { StyledCreditProductCard } from "../styles";

interface INewCreditProductCardProps {
  onClick: () => void;
}

export function NewCreditProductCard(props: INewCreditProductCardProps) {
  const { onClick } = props;

  return (
    <StyledCreditProductCard onClick={onClick} $new={true}>
      <Stack direction="column" alignItems="center" margin="auto">
        <Icon icon={<MdOutlineAdd />} appearance="gray" size="45px" />
        <Text type="body" size="large" appearance="gray">
          {dataNewCard.add}
        </Text>
      </Stack>
    </StyledCreditProductCard>
  );
}
