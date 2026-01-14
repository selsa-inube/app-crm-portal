import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { mockGuaranteeMortgage } from "@mocks/guarantee/offeredguarantee.mock";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataMortgage } from "./config";

interface IMortgage {
  isMobile: boolean;
  lang: EnumType;
}

export function Mortgage(props: IMortgage) {
  const { isMobile, lang } = props;

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
          {dataMortgage.title.i18n[lang]}
        </Text>
        <Divider dashed />
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
          autoRows="auto"
          gap="20px"
        >
          <CardGray
            label={dataMortgage.property.i18n[lang]}
            placeHolder={data.property}
          />
          <CardGray
            label={dataMortgage.state.i18n[lang]}
            placeHolder={data.state}
          />
          <CardGray
            label={dataMortgage.years.i18n[lang]}
            placeHolder={data.years}
          />
          <CardGray
            label={dataMortgage.value.i18n[lang]}
            placeHolder={`$ ${data.value}`}
          />
        </Grid>
        <CardGray
          label={dataMortgage.description.i18n[lang]}
          placeHolder={data.description}
        />
      </Stack>
    </Fieldset>
  );
}
