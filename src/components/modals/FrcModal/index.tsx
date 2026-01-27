import { useEffect, useState } from "react";
import {
  MdErrorOutline,
  MdExpandMore,
  MdInfoOutline,
  MdQueryStats,
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
import { Fieldset } from "@components/data/Fieldset";
import { getCreditLimitByCreditRiskAnalysis } from "@services/creditLimit/getCreditLimitByCreditRiskAnalysis";
import { IMaximumCreditLimitAnalysis } from "@services/creditLimit/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { useToken } from "@hooks/useToken";

import { frcConfig, InfoModalType } from "./FrcConfig";
import { StyledExpanded } from "./styles";

export interface ScoreModalProps {
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  lang: EnumType;
  loading?: boolean;
}

export const ScoreModal = (props: ScoreModalProps) => {
  const {
    handleClose,
    businessUnitPublicCode,
    businessManagerCode,
    clientIdentificationNumber,
    lang,
    loading,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const { getAuthorizationToken } = useToken();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentInfoType, setCurrentInfoType] =
    useState<InfoModalType>("intercept");
  const [isExpanded, setIsExpanded] = useState(false);

  const [error, setError] = useState(false);
  const [
    dataMaximumCreditLimitReciprocity,
    setDataMaximumCreditLimitReciprocity,
  ] = useState<IMaximumCreditLimitAnalysis>({
    assignedCreditLimit: 0,
    creditRiskMultiplier: 0,
    creditRiskScore: 0,
    maxAmountAvailableByCreditRiskAnalysis: 0,
    totalMonthlyIncome: 0,
    totalPortfolioObligation: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorizationToken = await getAuthorizationToken();

        const data = await getCreditLimitByCreditRiskAnalysis(
          businessUnitPublicCode,
          businessManagerCode,
          clientIdentificationNumber,
          authorizationToken,
        );

        if (data) {
          setDataMaximumCreditLimitReciprocity(data);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, [businessUnitPublicCode, businessManagerCode, clientIdentificationNumber]);

  const handleInfoClick = (type: InfoModalType) => {
    setCurrentInfoType(type);
    setShowInfoModal(true);
  };

  const getInfoText = () => {
    return frcConfig.infoTexts[currentInfoType].i18n[lang];
  };

  return (
    <BaseModal
      title={frcConfig.title.i18n[lang]}
      nextButton={frcConfig.closeBtn.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "290px" : "500px"}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {frcConfig.error.title.i18n[lang]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {frcConfig.error.message.i18n[lang]}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="16px">
          <Stack direction="column" gap="12px">
            <Stack alignItems="center" justifyContent="space-between">
              <Stack gap="8px">
                <Icon
                  appearance="primary"
                  icon={<MdQueryStats />}
                  disabled={false}
                  size="34px"
                />
                <Text appearance="primary" size="large" type="title">
                  {frcConfig.subTitle.i18n[lang]}
                </Text>
              </Stack>
              <Stack alignItems="center">
                <Text
                  type="body"
                  weight="bold"
                  size="medium"
                  appearance="primary"
                >
                  {dataMaximumCreditLimitReciprocity.creditRiskScore || 0}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {frcConfig.totalScoreMax.i18n[lang]}
                  </Text>
                )}
                <StyledExpanded $expanded={isExpanded}>
                  <Icon
                    icon={<MdExpandMore />}
                    appearance="primary"
                    cursorHover
                    onClick={() => setIsExpanded((prev) => !prev)}
                  />
                </StyledExpanded>
              </Stack>
            </Stack>
            <Divider />
            {isExpanded && (
              <>
                <Stack justifyContent="space-between" alignItems="center">
                  <Text weight="bold" size="large" type="label">
                    {frcConfig.intercept.i18n[lang]}
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Stack gap="6px">
                      <Text appearance="primary" weight="bold" size="large">
                        0
                      </Text>
                      <Stack margin="4px 0 0 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="14px"
                          onClick={() => handleInfoClick("intercept")}
                          cursorHover
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                  <Text weight="bold" size="large" type="label">
                    {frcConfig.seniorityLabel.i18n[lang]}
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Stack gap="6px">
                      <Text appearance="primary" weight="bold" size="large">
                        0
                      </Text>
                      <Stack margin="4px 0 0 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="14px"
                          onClick={() => handleInfoClick("seniority")}
                          cursorHover
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                  <Text weight="bold" size="large" type="label">
                    {frcConfig.centralRiskLabel.i18n[lang]}
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Stack gap="6px">
                      <Text appearance="primary" weight="bold" size="large">
                        0
                      </Text>
                      <Stack margin="4px 0 0 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="14px"
                          onClick={() => handleInfoClick("centralRisk")}
                          cursorHover
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                  <Text weight="bold" size="large" type="label">
                    {frcConfig.employmentStabilityLabel.i18n[lang]}
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Stack gap="6px">
                      <Text appearance="primary" weight="bold" size="large">
                        0
                      </Text>
                      <Stack margin="4px 0 0 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="14px"
                          onClick={() => handleInfoClick("employmentStability")}
                          cursorHover
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                  <Text weight="bold" size="large" type="label">
                    {frcConfig.maritalStatusLabel.i18n[lang]}
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Stack gap="6px">
                      <Text appearance="primary" weight="bold" size="large">
                        0
                      </Text>
                      <Stack margin="4px 0 0 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="14px"
                          onClick={() => handleInfoClick("maritalStatus")}
                          cursorHover
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                  <Text weight="bold" size="large" type="label">
                    {frcConfig.economicActivityLabel.i18n[lang]}
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Stack gap="6px">
                      <Text appearance="primary" weight="bold" size="large">
                        0
                      </Text>
                      <Stack margin="4px 0 0 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="14px"
                          onClick={() => handleInfoClick("economicActivity")}
                          cursorHover
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </>
            )}
          </Stack>
          <Divider dashed />
          <Stack justifyContent="space-between">
            <Text weight="bold" size="large" type="label">
              {frcConfig.incomesLabel.i18n[lang]}
            </Text>
            <Stack>
              <Text appearance="success">$</Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text>
                  {currencyFormat(
                    dataMaximumCreditLimitReciprocity.totalMonthlyIncome || 0,
                    false,
                  )}
                </Text>
              )}
            </Stack>
          </Stack>
          <Stack justifyContent="space-between" alignItems="center">
            <Text weight="bold" size="large" type="label">
              {frcConfig.timesIncome.i18n[lang]}
            </Text>
            {loading ? (
              <SkeletonLine width="70px" animated={true} />
            ) : (
              <Text type="body" size="large">
                x{dataMaximumCreditLimitReciprocity.creditRiskMultiplier || 0}
              </Text>
            )}
          </Stack>
          <Divider dashed />
          <Stack justifyContent="space-between">
            <Text weight="bold" size="large" type="label">
              {frcConfig.maxLimit.i18n[lang]}
            </Text>
            <Stack>
              <Text appearance="success">$</Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text>
                  {currencyFormat(
                    dataMaximumCreditLimitReciprocity.maxAmountAvailableByCreditRiskAnalysis ||
                      0,
                    false,
                  )}
                </Text>
              )}
            </Stack>
          </Stack>
          <Stack justifyContent="space-between" alignItems="center">
            <Text weight="bold" size="large" type="label">
              {frcConfig.totalPortafolio.i18n[lang]}
            </Text>
            <Stack>
              <Text appearance="success">$</Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text>
                  {currencyFormat(
                    dataMaximumCreditLimitReciprocity.assignedCreditLimit || 0,
                    false,
                  )}
                </Text>
              )}
            </Stack>
          </Stack>
          <Fieldset>
            <Stack alignItems="center" direction="column" gap="8px">
              {loading ? (
                <Text
                  appearance="primary"
                  weight="bold"
                  type="headline"
                  size="large"
                >
                  {frcConfig.loading.i18n[lang]}
                </Text>
              ) : (
                <Text
                  appearance="primary"
                  weight="bold"
                  type="headline"
                  size="large"
                >
                  $
                  {currencyFormat(
                    dataMaximumCreditLimitReciprocity.totalPortfolioObligation ||
                      0,
                    false,
                  )}
                </Text>
              )}
              <Stack>
                <Text appearance="gray" size="small" textAlign="center">
                  {frcConfig.maxIndebtedness.i18n[lang]}
                </Text>
              </Stack>
            </Stack>
          </Fieldset>
          {showInfoModal && (
            <BaseModal
              title="Información"
              nextButton="Entendido"
              handleClose={() => setShowInfoModal(false)}
              handleNext={() => setShowInfoModal(false)}
              width={isMobile ? "290px" : "500px"}
            >
              <Text>{getInfoText()}</Text>
            </BaseModal>
          )}
        </Stack>
      )}
    </BaseModal>
  );
};
