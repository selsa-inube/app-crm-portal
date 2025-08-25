import {
  Stack,
  Text,
  SkeletonLine,
  Divider,
  useMediaQuery,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";

import { dataReciprocity } from "./config";

export interface ReciprocityModalProps {
  handleClose: () => void;
  balanceOfContributions: number;
  accordingToRegulation: number;
  assignedQuota: number;
  numRegulations: number;
  loading?: boolean;
}

export function ReciprocityModal(props: ReciprocityModalProps) {
  const {
    handleClose,
    balanceOfContributions,
    accordingToRegulation,
    assignedQuota,
    numRegulations,
    loading,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  return (
    <BaseModal
      title={dataReciprocity.maxReciprocityQuota}
      nextButton={dataReciprocity.close}
      handleNext={handleClose}
      handleBack={handleClose}
      variantNext="outlined"
      width={isMobile ? "290px" : "auto"}
    >
      <Stack
        direction="column"
        gap="24px"
        width={!isMobile ? "450px" : "287px"}
      >
        <Stack direction="column" justifyContent="space-between" gap="12px">
          <Stack justifyContent="space-between">
            <Text type="label" size="large" weight="bold">
              {dataReciprocity.contributionsBalance}
            </Text>
            <Stack>
              <Text type="body" size="medium" appearance="success">
                $
              </Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="medium">
                  {currencyFormat(balanceOfContributions, false)}
                </Text>
              )}
            </Stack>
          </Stack>
          <Stack justifyContent="space-between">
            <Text type="label" size="large" appearance="gray">
              {dataReciprocity.timesPossible}
            </Text>
            <Stack>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="medium">
                  x{currencyFormat(numRegulations, false)}
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Divider dashed />
        <Stack direction="column" justifyContent="space-between" gap="12px">
          <Stack justifyContent="space-between">
            <Text type="label" size="large" weight="bold">
              {dataReciprocity.assignedQuota}
            </Text>
            <Stack>
              <Text type="body" size="medium" appearance="success">
                $
              </Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="medium">
                  {currencyFormat(balanceOfContributions, false)}
                </Text>
              )}
            </Stack>
          </Stack>
          <Stack justifyContent="space-between">
            <Text type="label" size="large" appearance="gray">
              {dataReciprocity.currentPortafolio}
            </Text>
            <Stack>
              <Text type="body" size="medium" appearance="success">
                $
              </Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="medium">
                  {currencyFormat(accordingToRegulation, false)}
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack alignItems="center" direction="column" gap="8px">
          {loading ? (
            <Text
              appearance="primary"
              weight="bold"
              type="headline"
              size="large"
            >
              {dataReciprocity.loading}
            </Text>
          ) : (
            <Text
              appearance="primary"
              weight="bold"
              type="headline"
              size="large"
            >
              ${currencyFormat(assignedQuota, false)}
            </Text>
          )}
          <Stack>
            <Text appearance="gray" size="small" textAlign="center">
              {dataReciprocity.mount}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </BaseModal>
  );
}
