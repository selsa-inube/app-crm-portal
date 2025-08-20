import { useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";

import { dataIncomeModal } from "./config";

interface IncomeModalProps {
  handleClose: () => void;
  onSubmit: (updatedData: IIncomeSources) => void;
  openModal?: (state: boolean) => void;
  initialValues?: IIncomeSources;
  disabled?: boolean;
}

export function IncomeModal(props: IncomeModalProps) {
  const { handleClose, openModal, disabled, initialValues, onSubmit } = props;

  const [formData, setFormData] = useState(initialValues);

  const handleDataChange = (newData: IIncomeSources) => {
    setFormData(newData);
  };
  const isMobile = useMediaQuery("(max-width:880px)");

  const { addFlag } = useFlag();

  const handleSubmit = () => {
    onSubmit(formData as IIncomeSources);
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
        data={initialValues}
        showEdit={false}
        onDataChange={handleDataChange}
      />
    </BaseModal>
  );
}

export type { IncomeModalProps };
