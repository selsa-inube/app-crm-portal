import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { mockGuaranteeBail } from "@mocks/guarantee/offeredguarantee.mock";

import { dataBail } from "./config";

export function Bail() {
  const data = mockGuaranteeBail[0];

  return (
    <Fieldset>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        padding="12px"
        gap="20px"
        height="286px"
      >
        <Stack direction="column" gap="8px">
          <Text type="headline" weight="bold" size="large" appearance="primary">
            $ {data.value}
          </Text>
          <Text type="body" size="small" appearance="gray">
            {dataBail.bail}
          </Text>
        </Stack>
        <Text type="label" size="large">
          {dataBail.customer}
        </Text>
        <Stack gap="4px">
          <Icon icon={<MdInfoOutline />} appearance="dark" size="16px" />
          <Text type="body" size="medium" appearance="gray">
            {dataBail.disbursement}
          </Text>
        </Stack>
      </Stack>
    </Fieldset>
  );
}
