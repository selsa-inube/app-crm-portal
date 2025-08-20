import { useState } from "react";
import { MdExpandMore, MdInfoOutline, MdQueryStats } from "react-icons/md";
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

import { frcConfig } from "./FrcConfig";
import { StyledExpanded } from "./styles";

export interface ScoreModalProps {
  handleClose: () => void;
  subTitle: string;
  totalScore: number;
  seniority: number;
  centralRisk: number;
  employmentStability: number;
  maritalStatus: number;
  economicActivity: number;
  monthlyIncome: number;
  maxIndebtedness: number;
  incomeScore: number;
  maxLimit: number;
  totalPortafolio: number;
  loading?: boolean;
}

export const ScoreModal = (props: ScoreModalProps) => {
  const {
    handleClose,
    seniority,
    centralRisk,
    employmentStability,
    maritalStatus,
    economicActivity,
    monthlyIncome,
    maxIndebtedness,
    incomeScore,
    maxLimit,
    totalPortafolio,
    loading,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <BaseModal
      title={frcConfig.title}
      nextButton={frcConfig.closeBtn}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "290px" : "500px"}
    >
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
                {frcConfig.subTitle}
              </Text>
            </Stack>
            <Stack alignItems="center">
              <Text
                type="body"
                weight="bold"
                size="medium"
                appearance="primary"
              >
                {frcConfig.scoreLabel}
              </Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="medium">
                  {frcConfig.totalScoreMax}
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
                  {frcConfig.intercept}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Stack gap="6px">
                    <Text appearance="primary" weight="bold" size="large">
                      {seniority}
                    </Text>
                    <Stack margin="4px 0 0 0">
                      <Icon
                        icon={<MdInfoOutline />}
                        appearance="primary"
                        size="14px"
                        onClick={() => setShowInfoModal(true)}
                        cursorHover
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <Stack justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="large" type="label">
                  {frcConfig.seniorityLabel}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Stack gap="6px">
                    <Text appearance="primary" weight="bold" size="large">
                      {seniority}
                    </Text>
                    <Stack margin="4px 0 0 0">
                      <Icon
                        icon={<MdInfoOutline />}
                        appearance="primary"
                        size="14px"
                        onClick={() => setShowInfoModal(true)}
                        cursorHover
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <Stack justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="large" type="label">
                  {frcConfig.centralRiskLabel}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Stack gap="6px">
                    <Text appearance="primary" weight="bold" size="large">
                      {centralRisk}
                    </Text>
                    <Stack margin="4px 0 0 0">
                      <Icon
                        icon={<MdInfoOutline />}
                        appearance="primary"
                        size="14px"
                        onClick={() => setShowInfoModal(true)}
                        cursorHover
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <Stack justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="large" type="label">
                  {frcConfig.employmentStabilityLabel}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Stack gap="6px">
                    <Text appearance="primary" weight="bold" size="large">
                      {employmentStability}
                    </Text>
                    <Stack margin="4px 0 0 0">
                      <Icon
                        icon={<MdInfoOutline />}
                        appearance="primary"
                        size="14px"
                        onClick={() => setShowInfoModal(true)}
                        cursorHover
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <Stack justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="large" type="label">
                  {frcConfig.maritalStatusLabel}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Stack gap="6px">
                    <Text appearance="primary" weight="bold" size="large">
                      {maritalStatus}
                    </Text>
                    <Stack margin="4px 0 0 0">
                      <Icon
                        icon={<MdInfoOutline />}
                        appearance="primary"
                        size="14px"
                        onClick={() => setShowInfoModal(true)}
                        cursorHover
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <Stack justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="large" type="label">
                  {frcConfig.economicActivityLabel}
                </Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Stack gap="6px">
                    <Text appearance="primary" weight="bold" size="large">
                      {economicActivity}
                    </Text>
                    <Stack margin="4px 0 0 0">
                      <Icon
                        icon={<MdInfoOutline />}
                        appearance="primary"
                        size="14px"
                        onClick={() => setShowInfoModal(true)}
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
            {frcConfig.incomesLabel}
          </Text>
          <Stack>
            <Text appearance="success">$</Text>
            {loading ? (
              <SkeletonLine width="70px" animated={true} />
            ) : (
              <Text>{currencyFormat(monthlyIncome, false)}</Text>
            )}
          </Stack>
        </Stack>
        <Stack justifyContent="space-between" alignItems="center">
          <Text weight="bold" size="large" type="label">
            {frcConfig.timesIncome}
          </Text>
          {loading ? (
            <SkeletonLine width="70px" animated={true} />
          ) : (
            <Text type="body" size="large">
              x{incomeScore}
            </Text>
          )}
        </Stack>
        <Divider dashed />
        <Stack justifyContent="space-between">
          <Text weight="bold" size="large" type="label">
            {frcConfig.maxLimit}
          </Text>
          <Stack>
            <Text appearance="success">$</Text>
            {loading ? (
              <SkeletonLine width="70px" animated={true} />
            ) : (
              <Text>{currencyFormat(maxLimit, false)}</Text>
            )}
          </Stack>
        </Stack>
        <Stack justifyContent="space-between" alignItems="center">
          <Text weight="bold" size="large" type="label">
            {frcConfig.totalPortafolio}
          </Text>
          <Stack>
            <Text appearance="success">$</Text>
            {loading ? (
              <SkeletonLine width="70px" animated={true} />
            ) : (
              <Text>{currencyFormat(totalPortafolio, false)}</Text>
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
                {frcConfig.loading}
              </Text>
            ) : (
              <Text
                appearance="primary"
                weight="bold"
                type="headline"
                size="large"
              >
                ${currencyFormat(maxIndebtedness, false)}
              </Text>
            )}
            <Stack>
              <Text appearance="gray" size="small" textAlign="center">
                {frcConfig.maxIndebtedness}
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
            <Text>{frcConfig.loremIpsum}</Text>
          </BaseModal>
        )}
      </Stack>
    </BaseModal>
  );
};
