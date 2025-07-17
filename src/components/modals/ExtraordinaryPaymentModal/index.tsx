import { useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, useMediaQuery, Button } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment";
import { IProspect } from "@services/prospects/types";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";
import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallments,
} from "@services/iProspect/saveExtraordinaryInstallments/types";

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
          >
            {TextLabels.addSeries}
          </Button>
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
      </Stack>
    </BaseModal>
  );
};
