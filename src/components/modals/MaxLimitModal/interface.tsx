import { MdErrorOutline } from "react-icons/md";
import { Stack, Icon, Text, SkeletonLine, Divider } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { Fieldset } from "@components/data/Fieldset";
import { IMaximumCreditLimit } from "@services/creditLimit/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { analysisLabel } from "@pages/simulateCredit/components/CreditLimitCard/config";

import { incomeModalConfig } from "./IcomeModalConfig";

interface IMaxLimitModalUIProps {
  loading: boolean;
  error: boolean;
  isMobile: boolean;
  dataMaximumCreditLimitService: IMaximumCreditLimit;
  lang: EnumType;
  handleClose: () => void;
  creditLineTxt: string;
}

export const MaxLimitModalUI = (props: IMaxLimitModalUIProps) => {
  const {
    dataMaximumCreditLimitService,
    loading,
    error,
    isMobile,
    lang,
    handleClose,
    creditLineTxt,
  } = props;

  return (
    <BaseModal
      title={incomeModalConfig.title.i18n[lang]}
      nextButton={incomeModalConfig.buttons.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "287px" : "450px"}
      initialDivider={false}
      gap="14px"
    >
      <Text
        type="body"
        size="medium"
        appearance="gray"
        cursorHover={false}
        weight="normal"
      >
        {`${analysisLabel.i18n[lang]} ${creditLineTxt}`}
      </Text>
      <Stack margin="10px 0 12px 0">
        <Divider />
      </Stack>
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
                      dataMaximumCreditLimitService.lineOfCreditLoanAmountLimitRegulation,
                      false,
                      true,
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
                      true,
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
              {loading ? (
                <SkeletonLine width="220px" height="64px" animated={true} />
              ) : (
                <Text
                  appearance="primary"
                  weight="bold"
                  type="headline"
                  size="large"
                >
                  {currencyFormat(
                    dataMaximumCreditLimitService.customerCreditLimitInLineOfCredit ||
                      0,
                    true,
                    true,
                  ) || 0}
                </Text>
              )}
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
