import {
  MdOutlineVisibility,
  MdInfoOutline,
  MdErrorOutline,
  MdCached,
} from "react-icons/md";
import { Stack, Icon, Text, SkeletonLine, Divider } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";

import { incomeModalConfig } from "./IcomeModalConfig";

interface PaymentCapacityInterfaceProps {
  handleClose: () => void;
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
}

export const PaymentCapacityInterface = (
  props: PaymentCapacityInterfaceProps,
) => {
  const {
    handleClose,
    loading,
    error,
    title,
    isMobile,
    reportedIncomeSources,
    reportedFinancialObligations,
    subsistenceReserve,
    availableForNewCommitments,
    maxVacationTerm,
    maxAmount,
    iconVisible,
  } = props;

  return (
    <BaseModal
      title={title}
      nextButton={incomeModalConfig.buttons.recalculate}
      handleNext={() => alert("Recalculando...")}
      backButton={incomeModalConfig.buttons.close}
      handleBack={handleClose}
      handleClose={handleClose}
      iconBeforeNext={<MdCached />}
      width={isMobile ? "287px" : "450px"}
      finalDivider={true}
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
            <Stack justifyContent="space-between" alignItems="center">
              <Text appearance="dark" size="large" weight="bold" type="label">
                {incomeModalConfig.incomeSources.label}
              </Text>

              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(reportedIncomeSources, false)}
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

          <Divider />

          <Stack direction="column" gap="12px">
            <Stack justifyContent="space-between">
              <Text appearance="dark" size="large" weight="bold" type="label">
                {incomeModalConfig.availableCommitments.label}
              </Text>

              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(availableForNewCommitments, false)}
                  </Text>
                )}
              </Stack>
            </Stack>

            <Stack justifyContent="space-between">
              <Text appearance="dark" size="large" weight="bold" type="label">
                {incomeModalConfig.maxVacationTerm.label}
              </Text>

              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="medium">
                  {maxVacationTerm}
                </Text>
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack alignItems="center">
            <Icon
              appearance="primary"
              icon={<MdInfoOutline />}
              size="16px"
              spacing="wide"
            />
            <Text margin="0px 5px" size="small" type="body">
              {incomeModalConfig.maxAmountQuote}
            </Text>
          </Stack>

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
        </Stack>
      )}
    </BaseModal>
  );
};
