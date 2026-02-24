import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { IMortgages } from "@services/prospect/types";

import { dataMortgageEnum } from "./config";

interface IMortgage {
  isMobile: boolean;
  initialValues: IMortgages[];
  onRetry: () => Promise<void>;
  isLoadingMortgage: boolean;
  lang: "es" | "en";
}

export function Mortgage(props: IMortgage) {
  const { isMobile, initialValues, onRetry, isLoadingMortgage, lang } = props;

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
              {dataMortgageEnum.title.i18n[lang]}
            </Text>
            <Divider dashed />
            <Grid
              templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
              autoRows="auto"
              gap="20px"
            >
              <CardGray
                label={dataMortgageEnum.property.i18n[lang]}
                placeHolder={data.propertyType}
              />
              <CardGray
                label={dataMortgageEnum.state.i18n[lang]}
                placeHolder={data.propertyState}
              />
              <CardGray
                label={dataMortgageEnum.years.i18n[lang]}
                placeHolder={data.propertyAge}
              />
              <CardGray
                label={dataMortgageEnum.value.i18n[lang]}
                placeHolder={`$ ${data.propertyPrice}`}
              />
            </Grid>
            <CardGray
              label={dataMortgageEnum.description.i18n[lang]}
              placeHolder={data.descriptionUse}
            />
          </>
        ) : (
          <Stack margin="auto">
            <ItemNotFound
              image={userNotFound}
              title={dataMortgageEnum.noBorrowersTitle.i18n[lang]}
              description={dataMortgageEnum.noBorrowersDescription.i18n[lang]}
              buttonDescription={dataMortgageEnum.retry.i18n[lang]}
              onRetry={isLoadingMortgage ? undefined : onRetry}
            />
          </Stack>
        )}
      </Stack>
    </Fieldset>
  );
}
