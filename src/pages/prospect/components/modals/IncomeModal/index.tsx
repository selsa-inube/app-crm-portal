import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { income } from "@mocks/add-prospect/income/income.mock";

import { dataIncomeModal } from "./config";

interface IncomeModalProps {
  handleClose: () => void;
  openModal?: (state: boolean) => void;
  disabled?: boolean;
}

export function IncomeModal(props: IncomeModalProps) {
  const { handleClose, openModal, disabled } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  const { addFlag } = useFlag();

  const handleSubmit = () => {
    handleClose();
    addFlag({
      title: `${dataIncomeModal.flagTittle}`,
      description: `${dataIncomeModal.flagDescription}`,
      appearance: "success",
      duration: 5000,
    });
  };

  return (
    <BaseModal
      title={dataIncomeModal.title}
      nextButton={dataIncomeModal.save}
      backButton={dataIncomeModal.cancel}
      handleNext={handleSubmit}
      handleBack={handleClose}
      width={isMobile ? "auto" : "1002px"}
      finalDivider={true}
    >
      <SourceIncome
        ShowSupport={false}
        disabled={disabled}
        openModal={openModal}
        data={income}
      />
    </BaseModal>
  );
}

export type { IncomeModalProps };
