import { useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";
import { ICustomerData } from "@context/CustomerContext/types";

import { dataIncomeModal } from "./config";
import { IIncome } from "../../SourceIncome/types";

interface IncomeModalProps {
  handleClose: () => void;
  onSubmit: (updatedData: IIncomeSources) => void;
  openModal?: (state: boolean) => void;
  initialValues?: IIncomeSources;
  customerData?: ICustomerData;
  disabled?: boolean;
  dataValues?: IIncome | null;
}

export function IncomeModal(props: IncomeModalProps) {
  const { handleClose, openModal, initialValues, customerData, onSubmit } =
    props;

  const [formData, setFormData] = useState<IIncomeSources | undefined>(
    initialValues,
  );

  const handleDataChange = (newData: IIncomeSources) => {
    setFormData(newData);
  };

  const isMobile = useMediaQuery("(max-width:880px)");
  const { addFlag } = useFlag();

  const handleSubmit = () => {
    if (formData) {
      onSubmit(formData);
      addFlag({
        title: `${dataIncomeModal.flagTittle}`,
        description: `${dataIncomeModal.flagDescription}`,
        appearance: "success",
        duration: 5000,
      });
    }
    handleClose();
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
        disabled={false}
        openModal={openModal}
        data={formData || initialValues}
        customerData={customerData}
        showEdit={false}
        onDataChange={handleDataChange}
      />
    </BaseModal>
  );
}

export type { IncomeModalProps };
