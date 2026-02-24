import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { IPledges } from "@services/prospect/types";
import { useEnum } from "@hooks/useEnum/useEnum";

import { dataPledgeEnum } from "./config";

interface IPledge {
  isMobile: boolean;
  initialValues: IPledges[];
  onRetry: () => Promise<void>;
  isLoadingPledge: boolean;
}

export function Pledge(props: IPledge) {
  const { isMobile, initialValues, onRetry, isLoadingPledge } = props;
  const { lang } = useEnum();

  const data = initialValues[0];

  return (
    <Fieldset>
      <Stack
        direction="column"
        width={isMobile ? "265px" : "568px"}
        height="274px"
        padding="8px"
        gap="16px"
      >
        {data ? (
          <>
            <Text type="label" weight="bold" size="large">
              {dataPledgeEnum.title.i18n[lang]}
            </Text>
            <Divider dashed />
            <Grid
              templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
              autoRows="auto"
              gap="20px"
            >
              <CardGray
                label={dataPledgeEnum.state.i18n[lang]}
                placeHolder={data.vehiculeState}
              />
              <CardGray
                label={dataPledgeEnum.years.i18n[lang]}
                placeHolder={data.vehiculeAge}
              />
              <CardGray
                label={dataPledgeEnum.value.i18n[lang]}
                placeHolder={`$ ${data.vehiculePrice}`}
              />
            </Grid>
            <CardGray
              label={dataPledgeEnum.description.i18n[lang]}
              placeHolder={data.descriptionUse}
            />
          </>
        ) : (
          <Stack margin="auto">
            <ItemNotFound
              image={userNotFound}
              title={dataPledgeEnum.noBorrowersTitle.i18n[lang]}
              description={dataPledgeEnum.noBorrowersDescription.i18n[lang]}
              buttonDescription={dataPledgeEnum.retry.i18n[lang]}
              onRetry={isLoadingPledge ? undefined : onRetry}
            />
          </Stack>
        )}
      </Stack>
    </Fieldset>
  );
}
