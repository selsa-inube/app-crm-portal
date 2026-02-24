import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";

import { dataBailEnum } from "./config";

interface IBailProps {
  data: number;
  lang: "es" | "en";
}

export function Bond(props: IBailProps) {
  const { data, lang } = props;

  return (
    <Fieldset>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        padding="12px"
        gap="20px"
        height="266px"
      >
        {data ? (
          <>
            <Stack direction="column" gap="8px" alignItems="center">
              <Text
                type="headline"
                weight="bold"
                size="large"
                appearance="primary"
              >
                {currencyFormat(data)}
              </Text>
              <Text type="body" size="small" appearance="gray">
                {dataBailEnum.bond.i18n[lang]}
              </Text>
            </Stack>
            <Text type="label" size="large">
              {dataBailEnum.customer.i18n[lang]}
            </Text>
            <Stack gap="4px">
              <Icon icon={<MdInfoOutline />} appearance="dark" size="16px" />
              <Text type="body" size="medium" appearance="gray">
                {dataBailEnum.disbursement.i18n[lang]}
              </Text>
            </Stack>
          </>
        ) : (
          <Stack margin="auto">
            <ItemNotFound
              image={userNotFound}
              title={dataBailEnum.noBorrowersTitle.i18n[lang]}
              description={dataBailEnum.noBorrowersDescription.i18n[lang]}
              buttonDescription={dataBailEnum.retry.i18n[lang]}
            />
          </Stack>
        )}
      </Stack>
    </Fieldset>
  );
}
