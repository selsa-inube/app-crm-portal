import { useEffect } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { CreditLimitCard } from "@pages/simulateCredit/components/CreditLimitCard";
import { IPaymentChannel } from "@services/creditRequest/types";
import { mockCreditLimit } from "@mocks/add-prospect/modals-amount/modalsAmount.mock";
import { get } from "@mocks/utils/dataMock.service";

import { dataCreditLimitModal } from "./config";

export interface ICreditLimitModalProps {
  handleClose: () => void;
  isMobile: boolean;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
}

export function CreditLimitModal(props: ICreditLimitModalProps) {
  const { isMobile, handleClose, setRequestValue } = props;

  const creditCardsData = mockCreditLimit;
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

  return (
    <BaseModal
      title={dataCreditLimitModal.title}
      nextButton={dataCreditLimitModal.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px " : "450px"}
      height={isMobile ? "auto" : "377px"}
      finalDivider={true}
    >
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
          {creditCardsData.map((item, index) => (
            <CreditLimitCard
              key={index}
              creditLineTxt={item.creditLineTxt}
              creditLine={item.creditLine}
              creditLimitData={item.creditLimitdata}
              maxLimitData={item.maxLimitData}
              paymentCapacityData={item.paymentCapacityData}
              reciprocityData={item.reciprocityData}
              scoreData={item.scoreData}
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
    </BaseModal>
  );
}
