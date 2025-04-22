import { useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, useMediaQuery, Button } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment";
import { IExtraordinaryPayment } from "@services/types";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";

import { TextLabels } from "./config";

export interface ExtraordinaryPaymentModalProps {
  dataTable: IExtraordinaryPayment[];
  handleClose: () => void;
  onClickDetails?: (id: string) => void;
  onClickEdit?: (id: string) => void;
  onClickEliminate?: (id: string) => void;
}

export const ExtraordinaryPaymentModal = (
  props: ExtraordinaryPaymentModalProps,
) => {
  const { handleClose } = props;

  const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:880px)");

  const handleConfirm = () => {
    console.log("Confirmar acción");
  };

  const openAddSeriesModal = () => {
    setAddSeriesModalOpen(true);
  };

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
          <TableExtraordinaryInstallment />
        </Stack>
        {isAddSeriesModalOpen && (
          <AddSeriesModal
            handleClose={closeAddSeriesModal}
            onSubmit={handleSubmit}
            onConfirm={handleConfirm}
            initialValues={{ field1: 0, field2: 0 }}
          />
        )}
      </Stack>
    </BaseModal>
  );
};
