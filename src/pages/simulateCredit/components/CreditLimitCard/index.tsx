import { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CreditLimit } from "@components/modals/CreditLimit";
import { MaxLimitModal } from "@components/modals/MaxLimitModal";
import { ReciprocityModal } from "@components/modals/ReciprocityModal";
import { ScoreModal } from "@components/modals/FrcModal";
import { PaymentCapacityModal } from "@components/modals/PaymentCapacityModal";
import { EnumType } from "@hooks/useEnum/useEnum";

import { StyledContainer } from "./styles";
import { IdataMaximumCreditLimitService, IPaymentCapacityData } from "./types";
import { ISourcesOfIncomeState } from "../../types";

export interface CreditLimitProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  creditLine: number;
  creditLineTxt: string;
  paymentCapacityData?: IPaymentCapacityData;
  isMobile: boolean;
  userAccount: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  incomeData: ISourcesOfIncomeState;
  lang: EnumType;
}

export function CreditLimitCard(props: CreditLimitProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    creditLine,
    creditLineTxt,
    isMobile,
    userAccount,
    setError,
    error,
    incomeData,
    lang,
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
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
          lang={lang}
          creditLine={creditLineTxt}
          incomeData={incomeData}
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
          lang={lang}
        />
      )}

      {openModal === "reciprocityModal" && (
        <ReciprocityModal
          loading={loading}
          handleClose={() => setOpenModal(null)}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
          lang={lang}
        />
      )}

      {openModal === "paymentCapacity" && (
        <PaymentCapacityModal
          isMobile={isMobile}
          handleClose={() => setOpenModal(null)}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          userAccount={userAccount}
          dataMaximumCreditLimitService={{
            ...dataMaximumCreditLimitService,
            lineOfCreditAbbreviatedName: creditLineTxt,
          }}
          setError={setError}
          setLoading={setLoading}
          error={error}
          loading={loading}
          incomeData={incomeData}
          lang={lang}
        />
      )}

      {openModal === "scoreModal" && (
        <ScoreModal
          handleClose={() => setOpenModal(null)}
          loading={loading}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
          lang={lang}
        />
      )}
    </StyledContainer>
  );
}
