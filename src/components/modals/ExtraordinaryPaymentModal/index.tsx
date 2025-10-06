import { useState } from "react";
import { MdOutlineAdd, MdOutlineInfo } from "react-icons/md";
import { Stack, Icon, useMediaQuery, Button } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment";
import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";

import { TextLabels } from "./config";

export interface ExtraordinaryPaymentModalProps {
  businessUnitPublicCode: string;
  prospectData?: IProspect;
  sentData?: IExtraordinaryInstallments | null;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  handleClose: () => void;
}

export const ExtraordinaryPaymentModal = (
  props: ExtraordinaryPaymentModalProps,
) => {
  const {
    businessUnitPublicCode,
    prospectData,
    sentData,
    setSentData,
    handleClose,
  } = props;

  const [installmentState, setInstallmentState] = useState({
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  });
  const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:880px)");

  const openAddSeriesModal = () => {
    setInstallmentState({
      installmentAmount: 0,
      installmentDate: "",
      paymentChannelAbbreviatedName: "",
    });
    setAddSeriesModalOpen(true);
  };
  const [seriesModal, setSeriesModal] = useState<IExtraordinaryInstallment[]>(
    [],
  );
  const [selectedModal, setAddModal] =
    useState<IExtraordinaryInstallment | null>(null);
  const closeAddSeriesModal = () => {
    setAddSeriesModalOpen(false);
  };

  const handleSubmit = () => {
    closeAddSeriesModal();
  };
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <BaseModal
      title={TextLabels.extraPayments}
      nextButton={TextLabels.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={!isMobile ? "850px" : "290px"}
      finalDivider={true}
    >
      <Stack gap="24px" direction="column">
        <Stack justifyContent="end">
          <Button
            type="button"
            appearance="primary"
            spacing="wide"
            fullwidth={isMobile}
            iconBefore={
              <Icon
                icon={<MdOutlineAdd />}
                appearance="light"
                size="18px"
                spacing="narrow"
              />
            }
            onClick={openAddSeriesModal}
            disabled={canEditCreditRequest}
          >
            {TextLabels.addSeries}
          </Button>
          <Stack alignItems="center">
            {canEditCreditRequest ? (
              <Icon
                icon={<MdOutlineInfo />}
                appearance="primary"
                size="16px"
                cursorHover
                onClick={handleInfo}
              />
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
        <Stack>
          <TableExtraordinaryInstallment
            prospectData={prospectData}
            sentData={sentData}
            setSentData={setSentData}
            handleClose={closeAddSeriesModal}
            businessUnitPublicCode={businessUnitPublicCode}
          />
        </Stack>
        {isAddSeriesModalOpen && (
          <AddSeriesModal
            handleClose={closeAddSeriesModal}
            onSubmit={handleSubmit}
            installmentState={installmentState}
            setInstallmentState={setInstallmentState}
            setSentData={setSentData}
            sentData={sentData}
            seriesModal={seriesModal}
            setSeriesModal={setSeriesModal}
            setAddModal={setAddModal}
            selectedModal={selectedModal}
            prospectData={prospectData}
          />
        )}
        {isModalOpen ? (
          <InfoModal
            onClose={handleInfoModalClose}
            title={privilegeCrm.title}
            subtitle={privilegeCrm.subtitle}
            description={privilegeCrm.description}
            nextButtonText={privilegeCrm.nextButtonText}
            isMobile={isMobile}
          />
        ) : (
          <></>
        )}
      </Stack>
    </BaseModal>
  );
};
