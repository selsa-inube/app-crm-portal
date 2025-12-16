import {
  Stack,
  Button,
  Breadcrumbs,
  Icon,
  Text,
  Assisted,
} from "@inubekit/inubekit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdArrowBack, MdCheckCircle, MdOutlineRule } from "react-icons/md";

import { ErrorModal } from "@components/modals/ErrorModal";
import { ICustomerData } from "@context/CustomerContext/types";
import { ErrorPage } from "@components/layout/ErrorPage";
import userImage from "@assets/images/userImage.jpeg";
import { IValidateRequirement } from "@services/requirement/types";
import { BaseModal } from "@components/modals/baseModal";
import { ButtonRequirements } from "@pages/prospect/components/buttonRequirements";
import { IProspect } from "@services/prospect/types";
import { IFormData, IManageErrors } from "@pages/simulateCredit/types";
import { RequirementsModal } from "@pages/prospect/components/modals/RequirementsModal";

import { GeneralHeader } from "../../simulateCredit/components/GeneralHeader";
import { IDataHeader } from "../../simulations/types";
import {
  IStep,
  StepDetails,
  IBonusFormData,
  IProspectSummaryById,
} from "./types";
import {
  addConfig,
  dataSubmitApplication,
  disbursemenTabs,
  tittleOptions,
  textAddCongfig,
} from "./config/addConfig";
import { StyledArrowBack, StyledContainerAssisted } from "../styles";
import { IDisbursementGeneral, titleButtonTextAssited } from "../types";
import { stepsAddBonus } from "./config/addBonus.config";
import { RequirementsNotMet } from "../steps/requirementsNotMet";
import { RequestedValue } from "../steps/requestedValue";
import { DisbursementGeneral } from "../steps/disbursementGeneral";
import {
  IMethodOfDisbursement,
  IPersonalInfo,
  VerificationPayrollOrnBonus,
} from "../steps/verification";

interface PayRollUIProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  navigate: ReturnType<typeof useNavigate>;
  currentStep: number;
  customerData: ICustomerData;
  dataHeader: IDataHeader;
  steps: IStep[];
  businessUnitPublicCode: string;
  businessManagerCode: string;
  isCurrentFormValid: boolean;
  isMobile: boolean;
  currentStepsNumber?: StepDetails;
  assistedButtonText: string;
  codeError: number | null;
  prospectData: IProspect;
  formData: IFormData;
  onAmountChange: (amount: string) => void;
  onValidationChange: (isValid: boolean) => void;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormChange: (updatedValues: Partial<IBonusFormData>) => void;
  prospectSummaryData?: IProspectSummaryById;
  modesOfDisbursement: string[];
  showErrorModal: boolean;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  messageError: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  addToFix?: string[];
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onRequirementsValidated: (requirements: IValidateRequirement[]) => void;
  showSubmitModal: boolean;
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingSubmit: boolean;
  handleSubmitBonus: () => void;
  validateRequirements: IValidateRequirement[];
  handleSubmitClick: () => void;
  isLoading: boolean;
  errorsManager: IManageErrors;
  handleSuccessModalClose: () => void;
  setIsModalOpenRequirements: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpenRequirements: boolean;
}

export function PayRollUI(props: PayRollUIProps) {
  const {
    handleNextStep,
    handlePreviousStep,
    validateRequirements,
    setCurrentStep,
    navigate,
    prospectData,
    currentStepsNumber,
    prospectSummaryData,
    handleFormChange,
    businessUnitPublicCode,
    businessManagerCode,
    dataHeader,
    steps,
    isCurrentFormValid,
    isMobile,
    codeError,
    modesOfDisbursement,
    addToFix,
    assistedButtonText,
    customerData,
    formData,
    onAmountChange,
    onValidationChange,
    setIsCurrentFormValid,
    showErrorModal,
    setShowErrorModal,
    messageError,
    setMessageError,
    onRequirementsValidated,
    showSubmitModal,
    setShowSubmitModal,
    showSuccessModal,
    setShowSuccessModal,
    isLoadingSubmit,
    handleSubmitBonus,
    handleSubmitClick,
    handleSuccessModalClose,
    setIsModalOpenRequirements,
    isModalOpenRequirements,
    isLoading,
    errorsManager,
  } = props;

  const [isSelected, setIsSelected] = useState<string>(
    disbursemenTabs.internal.id,
  );

  const handleTabChange = (tabId: string) => {
    setIsSelected(tabId);
  };

  if (codeError) {
    setShowErrorModal(true);
    setMessageError(tittleOptions.tryLater);
  }

  return (
    <>
      {codeError ? (
        <ErrorPage
          onClick={() => navigate("/clients/select-client/")}
          errorCode={codeError}
          addToFix={addToFix}
        />
      ) : (
        <Stack
          direction="column"
          width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
          margin={`20px auto ${isMobile ? "100px" : "60px"} auto`}
        >
          <Stack
            direction="column"
            alignItems={isMobile ? "normal" : "center"}
            margin="20px 0px"
          >
            <Stack gap="24px" direction="column" height="100%" width="100%">
              <GeneralHeader
                buttonText={textAddCongfig.buttonAddLink}
                descriptionStatus={dataHeader.status}
                name={dataHeader.name}
                profileImageUrl={dataHeader.image || userImage}
              />
              <Breadcrumbs crumbs={addConfig.crumbs} />
              <Stack justifyContent="space-between" alignItems="center">
                <StyledArrowBack onClick={() => navigate(addConfig.route)}>
                  <Stack gap="8px" alignItems="center" width="100%">
                    <Icon
                      icon={<MdArrowBack />}
                      appearance="dark"
                      size="20px"
                    />
                    <Text type="title" size={isMobile ? "small" : "large"}>
                      {addConfig.title}
                    </Text>
                  </Stack>
                  <Text type="title" size="small" appearance="gray">
                    {addConfig.subtitle}
                  </Text>
                </StyledArrowBack>
                <Stack gap="8px">
                  {isMobile ? (
                    <>
                      <Icon
                        icon={<MdOutlineRule />}
                        appearance="gray"
                        size="28px"
                        spacing="compact"
                        variant="outlined"
                        onClick={() => setIsModalOpenRequirements(true)}
                      />
                    </>
                  ) : (
                    <>
                      <ButtonRequirements
                        onClick={() => setIsModalOpenRequirements(true)}
                        data={validateRequirements}
                      />
                    </>
                  )}
                </Stack>
              </Stack>
              <StyledContainerAssisted $cursorDisabled={!isCurrentFormValid}>
                <Assisted
                  step={currentStepsNumber!}
                  totalSteps={steps.length}
                  onBackClick={handlePreviousStep}
                  onNextClick={handleNextStep}
                  controls={{
                    ...titleButtonTextAssited,
                    goNextText: assistedButtonText,
                  }}
                  onSubmitClick={handleSubmitClick}
                  disableNext={!isCurrentFormValid}
                  disableSubmit={!isCurrentFormValid}
                  showCurrentStepNumber={false}
                  size={isMobile ? "small" : "large"}
                />
              </StyledContainerAssisted>
              <Stack direction="column">
                <Stack justifyContent="end"></Stack>
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddBonus.generalInformation.id && (
                    <RequirementsNotMet
                      isMobile={isMobile}
                      prospectData={prospectData}
                      customerData={customerData}
                      businessUnitPublicCode={businessUnitPublicCode}
                      businessManagerCode={businessManagerCode}
                      onRequirementsValidated={onRequirementsValidated}
                    />
                  )}

                {currentStepsNumber &&
                  currentStepsNumber.id === stepsAddBonus.destination.id && (
                    <RequestedValue
                      initialAmount={formData.requestedValue}
                      onValidationChange={onValidationChange}
                      onAmountChange={onAmountChange}
                      isMobile={isMobile}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddBonus.methodOfDisbursement.id && (
                    <DisbursementGeneral
                      isMobile={isMobile}
                      onFormValid={setIsCurrentFormValid}
                      initialValues={
                        formData.disbursementGeneral as IDisbursementGeneral
                      }
                      handleOnChange={(values) =>
                        handleFormChange({ disbursementGeneral: values })
                      }
                      isSelected={isSelected || disbursemenTabs.internal.id}
                      handleTabChange={handleTabChange}
                      data={prospectData}
                      customerData={customerData}
                      identificationNumber={customerData?.publicCode || ""}
                      prospectSummaryData={prospectSummaryData}
                      modesOfDisbursement={modesOfDisbursement}
                    />
                  )}

                {currentStepsNumber &&
                  currentStepsNumber.id === stepsAddBonus.verification.id && (
                    <VerificationPayrollOrnBonus
                      setCurrentStep={setCurrentStep}
                      destinationOfMoney={Number(formData.requestedValue || 0)}
                      steps={{
                        personalInfo:
                          formData.requirementsValidation as IPersonalInfo,
                        destinations: formData.requestedValue || "",
                        methodOfDisbursement:
                          formData.disbursementGeneral as IMethodOfDisbursement,
                      }}
                    />
                  )}
              </Stack>
              <Stack justifyContent="end" gap="20px" margin="auto 0 0 0">
                <Button
                  variant="outlined"
                  appearance="gray"
                  onClick={handlePreviousStep}
                  disabled={currentStepsNumber === steps[0]}
                >
                  {textAddCongfig.buttonPrevious}
                </Button>
                <Button
                  onClick={
                    currentStepsNumber?.id === stepsAddBonus.verification.id
                      ? handleSubmitClick
                      : handleNextStep
                  }
                  disabled={!isCurrentFormValid}
                >
                  {assistedButtonText}
                </Button>
              </Stack>
            </Stack>
          </Stack>
          {showErrorModal && (
            <ErrorModal
              handleClose={() => setShowErrorModal(false)}
              isMobile={isMobile}
              message={messageError}
            />
          )}
          {showSubmitModal && (
            <BaseModal
              title={dataSubmitApplication.modals.submit.title}
              handleBack={() => setShowSubmitModal(false)}
              handleNext={handleSubmitBonus}
              disabledNext={false}
              backButton={dataSubmitApplication.modals.submit.cancelButton}
              nextButton={dataSubmitApplication.modals.submit.sendButton}
              apparenceNext="primary"
              width={isMobile ? "300px" : "500px"}
              isLoading={isLoadingSubmit}
            >
              <Text>
                {dataSubmitApplication.modals.submit.confirmationText}
              </Text>
            </BaseModal>
          )}
          {isModalOpenRequirements && (
            <RequirementsModal
              handleClose={() => setIsModalOpenRequirements(false)}
              isMobile={isMobile}
              isLoading={isLoading}
              validateRequirements={validateRequirements}
              errorsManager={errorsManager}
            />
          )}
          {showSuccessModal && (
            <BaseModal
              title={dataSubmitApplication.modals.success.title}
              handleBack={() => setShowSuccessModal(false)}
              handleNext={handleSuccessModalClose}
              disabledNext={false}
              nextButton={dataSubmitApplication.modals.success.buttonText}
              width={isMobile ? "300px" : "450px"}
              isLoading={false}
            >
              <Stack direction="column" alignItems="center" gap="24px">
                <Icon
                  icon={<MdCheckCircle />}
                  appearance="success"
                  size="68px"
                />
                <Stack gap="6px">
                  <Text type="body" size="large">
                    {dataSubmitApplication.modals.success.fileDescription}
                  </Text>
                  <Text type="body" size="large" weight="bold">
                    {dataSubmitApplication.modals.success.code}
                  </Text>
                </Stack>

                <Text type="body" size="medium" appearance="gray">
                  {dataSubmitApplication.modals.success.descriptionSolid}
                </Text>
              </Stack>
            </BaseModal>
          )}
        </Stack>
      )}
    </>
  );
}
