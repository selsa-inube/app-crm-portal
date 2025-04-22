import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { mockGuaranteeMortgage } from "@mocks/guarantee/offeredguarantee.mock";

import { dataMortgage } from "./config";

interface IMortgage {
  isMobile: boolean;
}

export function Mortgage(props: IMortgage) {
  const { isMobile } = props;

  const data = mockGuaranteeMortgage[0];

  return (
    <Fieldset>
      <Stack
        direction="column"
        width={isMobile ? "265px" : "582px"}
        height={isMobile ? "294px" : "auto"}
        padding="8px"
        gap="16px"
      >
        <Text type="label" weight="bold" size="large">
          {dataMortgage.title}
        </Text>
        <Divider dashed />
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
          autoRows="auto"
          gap="20px"
        >
          <CardGray label={dataMortgage.property} placeHolder={data.property} />
          <CardGray label={dataMortgage.state} placeHolder={data.state} />
          <CardGray label={dataMortgage.years} placeHolder={data.years} />
          <CardGray
            label={dataMortgage.value}
            placeHolder={`$ ${data.value}`}
          />
        </Grid>
        <CardGray
          label={dataMortgage.description}
          placeHolder={data.description}
        />
      </Stack>
    </Fieldset>
  );
}
