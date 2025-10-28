import { useContext, useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Icon, Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { CreditLimitCard } from "@pages/simulateCredit/components/CreditLimitCard";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/components/CreditLimitCard/types";
import {
  IMaximumCreditLimit,
  IPaymentChannel,
} from "@services/creditRequest/types";
import { getGlobalLimitByMoneyDestination } from "@services/creditLimit/getGlobalLimitByMoneyDestination";
import { IMaximumCreditLimitByMoneyDestination } from "@services/creditLimit/types";
import { postBusinessUnitRules } from "@services/creditLimit/getMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit";
import { AppContext } from "@context/AppContext";
import { get } from "@mocks/utils/dataMock.service";

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
}

export function CreditLimitModal(props: ICreditLimitModalProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    isMobile,
    moneyDestination,
    handleClose,
    setRequestValue,
  } = props;

  useEffect(() => {
    get("mockRequest_value")
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRequestValue(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching money destinations data:", error.message);
      });
  }, []);

  const [error, setError] = useState(false);
  const { eventData } = useContext(AppContext);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] = useState<
    IMaximumCreditLimitByMoneyDestination[]
  >([]);
  const [maximumCreditLimitData, setMaximumCreditLimitData] =
    useState<IMaximumCreditLimit | null>(null);
  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGlobalLimitByMoneyDestination(
          businessUnitPublicCode,
          businessManagerCode,
          moneyDestination,
          dataMaximumCreditLimitService.identificationDocumentNumber,
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
  ]);
  useEffect(() => {
    const fetchMaximumCreditLimit = async () => {
      try {
        const submitData: IMaximumCreditLimit = {
          customerCode:
            dataMaximumCreditLimitService.identificationDocumentNumber,
          dividends: 0,
          financialIncome: 0,
          leases: 0,
          lineOfCreditAbbreviatedName:
            dataMaximumCreditLimitService.lineOfCreditAbbreviatedName || "",
          moneyDestination: moneyDestination,
          otherNonSalaryEmoluments: 0,
          pensionAllowances: 0,
          periodicSalary: 0,
          personalBusinessUtilities: 0,
          professionalFees: 0,
        };

        const data = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          userAccount,
          submitData,
        );
        if (data) {
          setMaximumCreditLimitData(data);
        }
      } catch (err) {
        console.error("Error fetching maximum credit limit:", err);
        setError(true);
      }
    };

    fetchMaximumCreditLimit();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    moneyDestination,
    dataMaximumCreditLimitService,
  ]);
  return (
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
                maximumCreditLimitData={maximumCreditLimitData}
              />
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
  );
}
