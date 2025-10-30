import { useState, useEffect } from "react";
import { useMediaQuery } from "@inubekit/inubekit";
import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { useRestoreIncomeData } from "@hooks/useRestoreIncomeData";
import { IProspect } from "@services/prospect/types";

import { dataIncomeModal } from "./config";
import { IIncome } from "../../SourceIncome/types";

interface IncomeModalProps {
  handleClose: () => void;
  onSubmit: (updatedData: IIncomeSources) => void;
  openModal?: (state: boolean) => void;
  businessUnitPublicCode: string;
  initialValues?: IIncomeSources;
  disabled?: boolean;
  dataValues?: IIncome | null;
  customerData?: ICustomerData;
  borrowerOptions?: {
    id: `${string}-${string}-${string}-${string}-${string}`;
    label: string;
    value: string;
  }[];
  selectedIndex?: number;
  creditLimitData?: IIncomeSources | undefined;
  publicCode?: string;
  businessManagerCode: string;
  prospectData: IProspect | undefined;
}

export function IncomeModal(props: IncomeModalProps) {
  const {
    handleClose,
    openModal,
    disabled,
    businessUnitPublicCode,
    initialValues,
    onSubmit,
    borrowerOptions,
    selectedIndex,
    customerData,
    publicCode,
    businessManagerCode,
    prospectData,
  } = props;

  const [formData, setFormData] = useState(initialValues);
  const isMobile = useMediaQuery("(max-width:880px)");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const { restoreData } = useRestoreIncomeData({
    setShowErrorModal,
    setMessageError,

    onSuccess: (refreshedData) => {
      setFormData(refreshedData);
      handleDataChange(refreshedData);
    },
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({ ...initialValues });
    }
  }, [initialValues]);

  const handleDataChange = (newData: IIncomeSources) => {
    setFormData(newData);
  };

  const handleSubmit = () => {
    if (!formData) {
      return;
    }
    onSubmit(formData as IIncomeSources);
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
        disabled={disabled}
        openModal={openModal}
        data={formData}
        showEdit={false}
        onDataChange={handleDataChange}
        onRestore={restoreData}
        customerData={customerData}
        borrowerOptions={borrowerOptions}
        selectedIndex={selectedIndex}
        showErrorModal={showErrorModal}
        messageError={messageError}
        publicCode={publicCode || ""}
        businessUnitPublicCode={businessUnitPublicCode}
        businessManagerCode={businessManagerCode}
        prospectData={prospectData}
      />
    </BaseModal>
  );
}

export type { IncomeModalProps };
