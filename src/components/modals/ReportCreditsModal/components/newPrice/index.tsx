import { Stack, Text } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";

interface INewPriceProps {
  value: number;
  label: string;
}

export function NewPrice(props: INewPriceProps) {
  const { value, label } = props;

  return (
    <Stack direction="column" alignItems="center">
      <Text type="title" size="medium" appearance="gray" weight="bold">
        ${currencyFormat(value, false)}
      </Text>
      <Text type="body" size="small" appearance="gray" weight="normal">
        {label}
      </Text>
    </Stack>
  );
}
