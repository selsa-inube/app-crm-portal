import { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CreditLimit } from "@components/modals/CreditLimit";
import { MaxLimitModal } from "@components/modals/MaxLimitModal";
import { ReciprocityModal } from "@components/modals/ReciprocityModal";
import { ScoreModal } from "@components/modals/FrcModal";
import { PaymentCapacityModal } from "@components/modals/PaymentCapacityModal";

import { StyledContainer } from "./styles";
import {
  ICreditLimitData,
  IdataMaximumCreditLimitService,
  IPaymentCapacityData,
  IReciprocityData,
  IScoreData,
} from "./types";

export interface CreditLimitProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  creditLine: number;
  creditLineTxt: string;
  creditLimitData: ICreditLimitData;
  paymentCapacityData: IPaymentCapacityData;
  reciprocityData: IReciprocityData;
  scoreData: IScoreData;
  isMobile: boolean;
}

export function CreditLimitCard(props: CreditLimitProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    creditLine,
    creditLineTxt,
    creditLimitData,
    paymentCapacityData,
    reciprocityData,
    scoreData,
    isMobile,
  } = props;

  const [creditModal, setCreditModal] = useState(false);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    setCreditModal(true);
    setLoadingCredit(true);
    setTimeout(() => {
      setLoadingCredit(false);
    }, 2000);
  };

  const handleOpenModals = (modalName: string) => {
    setOpenModal(modalName);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <StyledContainer>
      <Stack direction="column" gap="6px" alignItems="center">
        <Text type="title" size="large" appearance="primary" weight="bold">
          {currencyFormat(creditLine)}
        </Text>
        <Divider dashed />
        <Stack direction="row" gap="6px" justifyContent="center">
          <Icon
            icon={<MdInfoOutline />}
            appearance="primary"
            size="16px"
            onClick={handleOpenModal}
            cursorHover
          />
          <Text type="body" size="small" appearance="gray" weight="normal">
            {creditLineTxt}
          </Text>
        </Stack>
      </Stack>

      {creditModal && (
        <CreditLimit
          handleClose={() => setCreditModal(false)}
          title="Cupos utilizados"
          loading={loadingCredit}
          onOpenMaxLimitModal={() => handleOpenModals("maxLimitModal")}
          onOpenPaymentCapacityModal={() => handleOpenModals("paymentCapacity")}
          onOpenReciprocityModal={() => handleOpenModals("reciprocityModal")}
          onOpenFrcModal={() => handleOpenModals("scoreModal")}
          {...creditLimitData}
        />
      )}

      {openModal === "maxLimitModal" && (
        <MaxLimitModal
          loading={loading}
          handleClose={() => setOpenModal(null)}
          iconVisible={true}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          dataMaximumCreditLimitService={{
            ...dataMaximumCreditLimitService,
            lineOfCreditAbbreviatedName: creditLineTxt,
          }}
        />
      )}

      {openModal === "reciprocityModal" && (
        <ReciprocityModal
          loading={loading}
          handleClose={() => setOpenModal(null)}
          {...reciprocityData}
        />
      )}

      {openModal === "paymentCapacity" && (
        <PaymentCapacityModal
          isMobile={isMobile}
          handleClose={() => setOpenModal(null)}
          {...paymentCapacityData}
        />
      )}

      {openModal === "scoreModal" && (
        <ScoreModal
          handleClose={() => setOpenModal(null)}
          subTitle="Your Financial Score"
          loading={loading}
          {...scoreData}
        />
      )}
    </StyledContainer>
  );
}
