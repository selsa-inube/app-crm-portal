import { useEffect, useMemo, useState, useContext } from "react";
import {
  MdOutlineVisibility,
  MdInfoOutline,
  MdErrorOutline,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  SkeletonLine,
  useMediaQuery,
  Divider,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { getGlobalCreditLimitByLineOfCredit } from "@services/creditLimit/getGlobalCreditLimitByLineOfCredit";
import { IMaximumCreditLimitByLineOfCredit } from "@services/creditLimit/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { AppContext } from "@context/AppContext";

import { creditLimitTexts, renderSkeletons } from "./creditLimitConfig";
import { StyledList } from "./styles";

export interface ICreditLimitProps {
  title: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  lang: EnumType;
  loading?: boolean;
  handleClose: () => void;
  onOpenMaxLimitModal?: () => void;
  onOpenPaymentCapacityModal?: () => void;
  onOpenReciprocityModal?: () => void;
  onOpenFrcModal?: () => void;
}

export const CreditLimit = (props: ICreditLimitProps) => {
  const {
    title,
    businessUnitPublicCode,
    businessManagerCode,
    clientIdentificationNumber,
    lang,
    loading,
    handleClose,
    onOpenMaxLimitModal,
    onOpenPaymentCapacityModal,
    onOpenReciprocityModal,
    onOpenFrcModal,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const { eventData } = useContext(AppContext);

  const [error, setError] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] = useState<
    IMaximumCreditLimitByLineOfCredit[]
  >([]);

  const isLoading = loading || internalLoading;

  useEffect(() => {
    const fetchData = async () => {
      setInternalLoading(true);
      try {
        const data = await getGlobalCreditLimitByLineOfCredit(
          businessUnitPublicCode,
          businessManagerCode,
          clientIdentificationNumber,
          eventData.token,
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchData();
  }, [businessUnitPublicCode, businessManagerCode, clientIdentificationNumber]);

  const limits = useMemo(() => {
    const map: Record<string, number> = {};

    dataMaximumCreditLimit.forEach((item) => {
      map[item.creditLimitCalculationMethodAbbreviatedName] =
        item.creditLimitCalculationMethodValue;
    });

    return {
      maxCreditLimit: map["MaxCreditLimit"],
      reciprocity: map["ReciprocityBasedCreditLimit"],
      paymentCapacity: map["PaymentCapacityBasedCreditLimit"],
      riskAnalysis: map["RiskAnalysisBasedCreditLimit"],
      personalized: map["Personalized"],
    };
  }, [dataMaximumCreditLimit]);

  const usableQuota = useMemo(() => {
    const validValues = [
      limits.maxCreditLimit,
      limits.reciprocity,
      limits.paymentCapacity,
      limits.riskAnalysis,
      limits.personalized,
    ].filter((val): val is number => val !== undefined);

    if (validValues.length === 0) return 0;
    return Math.min(...validValues);
  }, [limits]);

  return (
    <BaseModal
      title={title}
      nextButton={creditLimitTexts.close.i18n[lang]}
      handleNext={handleClose}
      width={isMobile ? "280px" : "550px"}
      height={isMobile ? "auto" : "477px"}
      handleBack={handleClose}
      finalDivider={true}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {creditLimitTexts.error.title.i18n[lang]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {creditLimitTexts.error.message.i18n[lang]}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="24px" height="310px">
          {isLoading ? (
            renderSkeletons()
          ) : (
            <StyledList>
              <Stack direction="column" gap="12px" height="160px">
                {limits.maxCreditLimit !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTexts.maxPaymentCapacity.i18n[lang]}
                      </Text>

                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        <Text type="body" size="medium" appearance="dark">
                          {currencyFormat(limits.maxCreditLimit || 0, false)}
                        </Text>
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover={true}
                            variant="filled"
                            shape="circle"
                            onClick={onOpenMaxLimitModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}
                {limits.reciprocity !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTexts.maxReciprocity.i18n[lang]}
                      </Text>
                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        <Text type="body" size="medium" appearance="dark">
                          {currencyFormat(limits.reciprocity || 0, false)}
                        </Text>
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover={true}
                            variant="filled"
                            shape="circle"
                            onClick={onOpenReciprocityModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}

                {limits.paymentCapacity !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTexts.maxDebtFRC.i18n[lang]}
                      </Text>
                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        <Text type="body" size="medium" appearance="dark">
                          {currencyFormat(limits.paymentCapacity || 0, false)}
                        </Text>
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover
                            variant="filled"
                            shape="circle"
                            onClick={onOpenPaymentCapacityModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}

                {limits.riskAnalysis !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTexts.maxIndebtedness.i18n[lang]}
                      </Text>
                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        <Text type="body" size="medium" appearance="dark">
                          {currencyFormat(limits.riskAnalysis || 0, false)}
                        </Text>
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover
                            variant="filled"
                            shape="circle"
                            onClick={onOpenFrcModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}
                {limits.personalized !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTexts.assignedLimit.i18n[lang]}
                      </Text>
                      <Stack alignItems="center" gap="4px">
                        <Text appearance="success">$</Text>
                        <Text
                          weight="bold"
                          type="body"
                          size="medium"
                          appearance="dark"
                        >
                          {currencyFormat(limits.personalized || 0, false)}
                        </Text>
                      </Stack>
                    </Stack>
                  </li>
                )}
              </Stack>
            </StyledList>
          )}

          <Divider />

          {isLoading ? (
            <>
              <SkeletonLine width="70%" height="20px" animated />
              <Stack direction="column" alignItems="center" gap="10px">
                <SkeletonLine width="150px" height="20px" animated />
                <SkeletonLine width="100px" height="30px" animated />
              </Stack>
            </>
          ) : (
            <>
              <Stack alignItems="center">
                <Icon
                  appearance="help"
                  icon={<MdInfoOutline />}
                  size="16px"
                  spacing="narrow"
                />
                <Text margin="0px 5px" size="small">
                  {creditLimitTexts.maxUsableQuote.i18n[lang]}
                </Text>
              </Stack>
              <Stack direction="column" alignItems="center">
                <Text
                  type="headline"
                  size="large"
                  weight="bold"
                  appearance="primary"
                >
                  {currencyFormat(usableQuota, true)}
                </Text>
                <Text type="body" size="small">
                  {creditLimitTexts.maxMount.i18n[lang] || 0}
                </Text>
              </Stack>
            </>
          )}
        </Stack>
      )}
    </BaseModal>
  );
};
