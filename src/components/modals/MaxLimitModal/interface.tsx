import { MdOutlineVisibility, MdErrorOutline } from "react-icons/md";
import { Stack, Icon, Text, SkeletonLine } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { Fieldset } from "@components/data/Fieldset";

import { incomeModalConfig } from "./IcomeModalConfig";

interface IMaxLimitModalUIProps {
  loading: boolean;
  error: boolean;
  title: string;
  isMobile: boolean;
  reportedIncomeSources: number;
  reportedFinancialObligations: number;
  subsistenceReserve: number;
  availableForNewCommitments: number;
  maxVacationTerm: number;
  maxAmount: number;
  iconVisible?: boolean;
  handleClose: () => void;
}

export const MaxLimitModalUI = (props: IMaxLimitModalUIProps) => {
  const {
    loading,
    error,
    title,
    isMobile,
    reportedFinancialObligations,
    subsistenceReserve,
    maxAmount,
    iconVisible,
    handleClose,
  } = props;

  return (
    <BaseModal
      title={title}
      nextButton={incomeModalConfig.buttons.close}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "287px" : "450px"}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {incomeModalConfig.error.title}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {incomeModalConfig.error.message}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="24px">
          <Stack direction="column" gap="12px">
            <Stack justifyContent="space-between">
              <Text size="large" weight="bold" type="label">
                {incomeModalConfig.financialObligations.label}
              </Text>

              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(reportedFinancialObligations, false)}
                  </Text>
                )}
                <Stack margin="0px 0px 0px 6px">
                  {!iconVisible && (
                    <Icon
                      appearance="primary"
                      icon={<MdOutlineVisibility />}
                      size="16px"
                      spacing="narrow"
                      cursorHover
                      variant="filled"
                      shape="circle"
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
            <Stack justifyContent="space-between">
              <Text appearance="gray" size="large" weight="bold" type="label">
                {incomeModalConfig.subsistenceReserve.label}
              </Text>
              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(subsistenceReserve, false)}
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
                ${loading ? "Cargando..." : currencyFormat(maxAmount, false)}
              </Text>
              <Text appearance="gray" size="small">
                {incomeModalConfig.maxAmount}
              </Text>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </BaseModal>
  );
};
