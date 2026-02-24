import { useEffect, useState, useContext } from "react";
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
import { EnumType } from "@hooks/useEnum/useEnum";
import { AppContext } from "@context/AppContext";

import { dataCreditLimitModal } from "./config";
import { StyledCardsContainer } from "./styles";

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
  lang: EnumType;
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
    lang,
  } = props;
  const { eventData } = useContext(AppContext);

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
          eventData.token,
          incomeData as IIncomeSources,
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setIsLoading(false);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    incomeData,
  ]);
  return (
    <>
      <BaseModal
        title={dataCreditLimitModal.title.i18n[lang]}
        nextButton={dataCreditLimitModal.close.i18n[lang]}
        handleNext={handleClose}
        handleClose={handleClose}
        width={isMobile ? "300px " : "450px"}
        finalDivider={true}
      >
        {error ? (
          <Stack direction="column" alignItems="center">
            <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
            <Text size="large" weight="bold" appearance="danger">
              {dataCreditLimitModal.error.title.i18n[lang]}
            </Text>
            <Text size="small" appearance="dark" textAlign="center">
              {dataCreditLimitModal.error.message.i18n[lang]}
            </Text>
          </Stack>
        ) : (
          <Stack direction="column" gap="26px">
            <Text appearance="gray" type="body" size="medium" weight="normal">
              {dataCreditLimitModal.creditText.i18n[lang]}
            </Text>
            <Stack
              direction={isMobile ? "column" : "row"}
              gap="24px"
              margin="0 auto"
              padding=" 0px 5px"
            >
              <StyledCardsContainer
                isMobile={isMobile}
                oneProduct={dataMaximumCreditLimit.length === 1}
                moreThanOneLine={dataMaximumCreditLimit.length > 2}
              >
                {isLoading
                  ? Array.from({ length: 2 }).map((_, index) => (
                      <StyledContainer key={index}>
                        <Stack
                          direction="column"
                          alignItems="center"
                          height="50px"
                          gap="10px"
                        >
                          <SkeletonLine width="80%" height="30px" animated />
                          <SkeletonLine width="40%" height="20px" animated />
                        </Stack>
                      </StyledContainer>
                    ))
                  : dataMaximumCreditLimit.map((item, index) => (
                      <CreditLimitCard
                        key={index}
                        creditLineTxt={item.lineOfCredit}
                        creditLine={item.creditLimitValue}
                        isMobile={isMobile}
                        businessUnitPublicCode={businessUnitPublicCode}
                        businessManagerCode={businessManagerCode}
                        dataMaximumCreditLimitService={
                          dataMaximumCreditLimitService
                        }
                        userAccount={userAccount}
                        setError={setError}
                        error={error}
                        incomeData={incomeData as IIncomeSources}
                        lang={lang}
                      />
                    ))}
              </StyledCardsContainer>
            </Stack>
            <Text appearance="gray" type="body" size="medium" weight="normal">
              <Text
                as="span"
                appearance="dark"
                type="body"
                size="medium"
                weight="bold"
              >
                {dataCreditLimitModal.import.i18n[lang]}
              </Text>
              {dataCreditLimitModal.textImport.i18n[lang]}
            </Text>
          </Stack>
        )}
      </BaseModal>
    </>
  );
}
