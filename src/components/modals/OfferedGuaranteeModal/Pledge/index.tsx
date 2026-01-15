import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { mockGuaranteePledge } from "@mocks/guarantee/offeredguarantee.mock";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataPledge } from "./config";

interface IPledge {
  isMobile: boolean;
  lang: EnumType;
}

export function Pledge(props: IPledge) {
  const { isMobile, lang } = props;

  const data = mockGuaranteePledge[0];

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
          {dataPledge.title.i18n[lang]}
        </Text>
        <Divider dashed />
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
          autoRows="auto"
          gap="20px"
        >
          <CardGray
            label={dataPledge.state.i18n[lang]}
            placeHolder={data.state}
          />
          <CardGray
            label={dataPledge.years.i18n[lang]}
            placeHolder={data.years}
          />
          <CardGray
            label={dataPledge.value.i18n[lang]}
            placeHolder={`$ ${data.value}`}
          />
        </Grid>
        <CardGray
          label={dataPledge.description.i18n[lang]}
          placeHolder={data.description}
        />
      </Stack>
    </Fieldset>
  );
}
