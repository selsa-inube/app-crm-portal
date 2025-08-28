import { useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";
import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { useRestoreIncomeData } from "@hooks/useRestoreIncomeData";

import { dataIncomeModal } from "./config";
import { IIncome } from "../../SourceIncome/types";

interface IncomeModalProps {
  handleClose: () => void;
  onSubmit: (updatedData: IIncomeSources) => void;
  openModal?: (state: boolean) => void;
  initialValues?: IIncomeSources;
  disabled?: boolean;
  dataValues?: IIncome | null;
  customerData?: ICustomerData;
}

export function IncomeModal(props: IncomeModalProps) {
  const { handleClose, openModal, disabled, initialValues, onSubmit } = props;

  const [formData, setFormData] = useState(initialValues);
  const isMobile = useMediaQuery("(max-width:880px)");
  const { addFlag } = useFlag();

  const { restoreData } = useRestoreIncomeData({
    onSuccess: (refreshedData) => {
      setFormData(refreshedData);
      handleDataChange(refreshedData);
    },
  });

  const handleDataChange = (newData: IIncomeSources) => {
    setFormData(newData);
  };

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
        data={formData}
        showEdit={false}
        onDataChange={handleDataChange}
        onRestore={restoreData}
        customerData={props.customerData}
      />
    </BaseModal>
  );
}

export type { IncomeModalProps };
