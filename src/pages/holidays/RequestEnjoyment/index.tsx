import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";

import { SendRequestModal } from "@components/modals/SendRequestModal";
import { RequestInfoModal } from "@components/modals/RequestInfoModal";

import { IGeneralInformationEntry } from "./forms/GeneralInformationForm/types";
import { RequestEnjoymentUI } from "./interface";
import { requestEnjoymentSteps } from "./config/assisted.config";
import { holidaysNavConfig } from "../config/nav.config";
import { ModalState } from "./types";

function RequestEnjoyment() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState<IGeneralInformationEntry>({
    id: "",
    daysOff: "",
    startDate: "",
    observations: "",
    contract: "",
  });

  const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);

  const [modalState, setModalState] = useState<ModalState>({
    isSendModalVisible: false,
    isRequestInfoModalVisible: false,
  });

  const generalInformationRef = useRef<FormikProps<IGeneralInformationEntry>>(null);

  const updateFormValues = () => {
    if (generalInformationRef.current) {
      setFormValues(generalInformationRef.current.values);
      setIsCurrentFormValid(generalInformationRef.current.isValid);
    }
  };

  const handleNextStep = () => {
    if (currentStep < holidaysNavConfig.length) {
      updateFormValues();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishAssisted = () => {
    setModalState((prev) => ({ ...prev, isSendModalVisible: true }));
  };

  const handleCloseSendModal = () => {
    setModalState((prev) => ({ ...prev, isSendModalVisible: false }));
  };

  const handleConfirmSendModal = () => {
    setModalState({
      isSendModalVisible: false,
      isRequestInfoModalVisible: true,
    });
  };

  const handleSubmitRequestInfoModal = () => {
    setModalState((prev) => ({ ...prev, isRequestInfoModalVisible: false }));
    navigate("/holidays", {
      state: {
        showFlag: true,
        flagTitle: "Solicitud enviada",
        flagMessage: "La solicitud de certificación fue enviada exitosamente.",
        isSuccess: true,
      },
    });
  };

  const { label: appName, crumbs: appRoute, url: navigatePage } = holidaysNavConfig[1];

  return (
    <>
      <RequestEnjoymentUI
        appName={appName}
        appRoute={appRoute}
        navigatePage={navigatePage}
        steps={requestEnjoymentSteps}
        currentStep={currentStep}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
        handleFinishAssisted={handleFinishAssisted}
        setIsCurrentFormValid={setIsCurrentFormValid}
        setCurrentStep={setCurrentStep}
        isCurrentFormValid={isCurrentFormValid}
        generalInformationRef={generalInformationRef}
        initialGeneralInformationValues={formValues}
      />
      {modalState.isSendModalVisible && (
        <SendRequestModal
          descriptionText="¿Realmente deseas enviar la solicitud de certificación?"
          onSubmitButtonClick={handleConfirmSendModal}
          onCloseModal={handleCloseSendModal}
          onSecondaryButtonClick={handleCloseSendModal}
        />
      )}

      {modalState.isRequestInfoModalVisible && (
        <RequestInfoModal
          requestId="#45678822"
          staffName="Nombre Nombre Apellido Apellido"
          onCloseModal={handleSubmitRequestInfoModal}
          onSubmitButtonClick={handleSubmitRequestInfoModal}
        />
      )}
    </>
  );
}

export { RequestEnjoyment };
