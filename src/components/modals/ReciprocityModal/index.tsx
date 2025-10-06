import { useEffect, useState } from "react";
import {
  Stack,
  Text,
  SkeletonLine,
  Divider,
  useMediaQuery,
  Icon,
} from "@inubekit/inubekit";
import { MdErrorOutline } from "react-icons/md";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { GetCreditLimitByReciprocity } from "@services/creditLimit/getCreditLimitByReciprocity";
import { IMaximumCreditLimitReciprocity } from "@services/creditLimit/types";

import { dataReciprocity } from "./config";

export interface ReciprocityModalProps {
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  loading?: boolean;
}

export function ReciprocityModal(props: ReciprocityModalProps) {
  const {
    handleClose,
    businessUnitPublicCode,
    businessManagerCode,
    clientIdentificationNumber,
    loading,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  const [error, setError] = useState(false);
  const [
    dataMaximumCreditLimitReciprocity,
    setDataMaximumCreditLimitReciprocity,
  ] = useState<IMaximumCreditLimitReciprocity>({
    allowedUsageCount: 0,
    assignedCreditLimit: 0,
    maxAmountAvailableByReciprocity: 0,
    permanentSavingsBalance: 0,
    unsecuredPortfolioObligation: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetCreditLimitByReciprocity(
          businessUnitPublicCode,
          businessManagerCode,
          clientIdentificationNumber,
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

  return (
    <BaseModal
      title={dataReciprocity.maxReciprocityQuota}
      nextButton={dataReciprocity.close}
      handleNext={handleClose}
      handleBack={handleClose}
      variantNext="outlined"
      width={isMobile ? "290px" : "auto"}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {dataReciprocity.error.title}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {dataReciprocity.error.message}
          </Text>
        </Stack>
      ) : (
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
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.permanentSavingsBalance,
                      false,
                    )}
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
                    x
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.allowedUsageCount,
                      false,
                    )}
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
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.assignedCreditLimit,
                      false,
                    )}
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
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.unsecuredPortfolioObligation,
                      false,
                    )}
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
                $
                {currencyFormat(
                  dataMaximumCreditLimitReciprocity.maxAmountAvailableByReciprocity,
                  false,
                )}
              </Text>
            )}
            <Stack>
              <Text appearance="gray" size="small" textAlign="center">
                {dataReciprocity.mount}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      )}
    </BaseModal>
  );
}
