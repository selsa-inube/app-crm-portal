import { MdErrorOutline } from "react-icons/md";
import { Stack, Icon, Text, SkeletonLine } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { Fieldset } from "@components/data/Fieldset";
import { IMaximumCreditLimit } from "@services/creditLimit/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { incomeModalConfig } from "./IcomeModalConfig";

interface IMaxLimitModalUIProps {
  loading: boolean;
  error: boolean;
  isMobile: boolean;
  dataMaximumCreditLimitService: IMaximumCreditLimit;
  lang: EnumType;
  handleClose: () => void;
}

export const MaxLimitModalUI = (props: IMaxLimitModalUIProps) => {
  const {
    dataMaximumCreditLimitService,
    loading,
    error,
    isMobile,
    lang,
    handleClose,
  } = props;

  return (
    <BaseModal
      title={incomeModalConfig.title.i18n[lang]}
      nextButton={incomeModalConfig.buttons.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "287px" : "450px"}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {incomeModalConfig.error.title.i18n[lang]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {incomeModalConfig.error.message.i18n[lang]}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="24px">
          <Stack direction="column" gap="12px">
            <Stack justifyContent="space-between">
              <Text size="large" weight="bold" type="label">
                {incomeModalConfig.financialObligations.label.i18n[lang]}
              </Text>
              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(
                      dataMaximumCreditLimitService.customerCreditLimitInLineOfCredit ||
                        0,
                      false,
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
            <Stack justifyContent="space-between">
              <Text appearance="gray" size="large" weight="bold" type="label">
                {incomeModalConfig.subsistenceReserve.label.i18n[lang]}
              </Text>
              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(
                      dataMaximumCreditLimitService.customerTotalObligationsInLineOfCredit ||
                        0,
                      false,
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Fieldset>
            <Stack
              justifyContent="center"
              alignItems="center"
              width="100%"
              direction="column"
              gap="8px"
            >
              <Text
                appearance="primary"
                weight="bold"
                type="headline"
                size="large"
              >
                $
                {loading
                  ? incomeModalConfig.loading.i18n[lang]
                  : currencyFormat(
                      dataMaximumCreditLimitService.lineOfCreditLoanAmountLimitRegulation ||
                        0,
                      false,
                    )}
              </Text>
              <Text appearance="gray" size="small">
                {incomeModalConfig.maxAmount.i18n[lang]}
              </Text>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </BaseModal>
  );
};
