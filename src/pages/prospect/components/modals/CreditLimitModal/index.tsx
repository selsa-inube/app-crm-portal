import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Icon, Stack, Text, SkeletonLine } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { CreditLimitCard } from "@pages/simulateCredit/components/CreditLimitCard";
import {
  IdataMaximumCreditLimitService,
  IPaymentCapacityData,
} from "@pages/simulateCredit/components/CreditLimitCard/types";
import { IPaymentChannel } from "@services/creditRequest/types";
import { getGlobalLimitByMoneyDestination } from "@services/creditLimit/getGlobalLimitByMoneyDestination";
import {
  IIncomeSources,
  IMaximumCreditLimitByMoneyDestination,
} from "@services/creditLimit/types";
import { IFormData } from "@pages/simulateCredit/types";
import { StyledContainer } from "@pages/simulateCredit/components/CreditLimitCard/styles";

import { dataCreditLimitModal } from "./config";

export interface ICreditLimitModalProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  isMobile: boolean;
  moneyDestination: string;
  handleClose: () => void;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  paymentCapacityData?: IPaymentCapacityData;
  userAccount: string;
  incomeData: IFormData | IIncomeSources;
}

export function CreditLimitModal(props: ICreditLimitModalProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    isMobile,
    moneyDestination,
    handleClose,
    userAccount,
    incomeData,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  useState(false);

  const [error, setError] = useState(false);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] = useState<
    IMaximumCreditLimitByMoneyDestination[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGlobalLimitByMoneyDestination(
          businessUnitPublicCode,
          businessManagerCode,
          moneyDestination,
          dataMaximumCreditLimitService.identificationDocumentNumber,
        );
        setIsLoading(false);
        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setIsLoading(false);
        setError(true);
      }
    };

    fetchData();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
  ]);
  return (
    <>
      <BaseModal
        title={dataCreditLimitModal.title}
        nextButton={dataCreditLimitModal.close}
        handleNext={handleClose}
        handleClose={handleClose}
        width={isMobile ? "300px " : "450px"}
        finalDivider={true}
      >
        {error ? (
          <Stack direction="column" alignItems="center">
            <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
            <Text size="large" weight="bold" appearance="danger">
              {dataCreditLimitModal.error.title}
            </Text>
            <Text size="small" appearance="dark" textAlign="center">
              {dataCreditLimitModal.error.message}
            </Text>
          </Stack>
        ) : (
          <Stack direction="column" gap="26px">
            <Text appearance="gray" type="body" size="medium" weight="normal">
              {dataCreditLimitModal.creditText}
            </Text>
            <Stack
              direction={isMobile ? "column" : "row"}
              gap="24px"
              margin="0 auto"
              padding=" 0px 5px"
            >
              {dataMaximumCreditLimit.map((item, index) => (
                <CreditLimitCard
                  key={index}
                  creditLineTxt={item.lineOfCredit}
                  creditLine={item.creditLimitValue}
                  isMobile={isMobile}
                  businessUnitPublicCode={businessUnitPublicCode}
                  businessManagerCode={businessManagerCode}
                  dataMaximumCreditLimitService={dataMaximumCreditLimitService}
                  userAccount={userAccount}
                  setError={setError}
                  error={error}
                  incomeData={incomeData as IIncomeSources}
                />
              ))}
              {isLoading &&
                Array.from({ length: 2 }).map(() => (
                  <StyledContainer>
                    <Stack
                      direction="column"
                      alignItems="center"
                      height="60px"
                      gap="10px"
                    >
                      <SkeletonLine width="80%" height="30px" animated />
                      <SkeletonLine width="40%" height="20px" animated />
                    </Stack>
                  </StyledContainer>
                ))}
            </Stack>
            <Text appearance="gray" type="body" size="medium" weight="normal">
              <Text
                as="span"
                appearance="dark"
                type="body"
                size="medium"
                weight="bold"
              >
                {dataCreditLimitModal.import}
              </Text>
              {dataCreditLimitModal.textImport}
            </Text>
          </Stack>
        )}
      </BaseModal>
    </>
  );
}
