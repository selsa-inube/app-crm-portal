import {
  Stack,
  Button,
  Breadcrumbs,
  Icon,
  Text,
  Assisted,
} from "@inubekit/inubekit";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdCheckCircle,
  MdHighlightOff,
  MdOutlineRule,
} from "react-icons/md";

import { ICustomerData } from "@context/CustomerContext/types";
import { ErrorPage } from "@components/layout/ErrorPage";
import { IValidateRequirement } from "@services/requirement/types";
import { BaseModal } from "@components/modals/baseModal";
import { ButtonRequirements } from "@pages/prospect/components/buttonRequirements";
import { IProspect } from "@services/prospect/types";
import { IFormData, IManageErrors } from "@pages/simulateCredit/types";
import { RequirementsModal } from "@pages/prospect/components/modals/RequirementsModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { EnumType } from "@hooks/useEnum/useEnum";

import { StyledArrowBack, StyledContainerAssisted } from "../styles";
import { IDisbursementGeneral, titleButtonTextAssited } from "../types";
import { stepsToApplyForPayrollAdvanceCredit } from "./config/addBonus.config";
import { RequirementsNotMet } from "../steps/requirementsNotMet";
import { RequestedValue } from "../steps/requestedValue";
import { DisbursementGeneral } from "../steps/disbursementGeneral";
import { IDataHeader } from "../../simulations/types";
import { IStep, IStepDetails, IBonusFormData } from "../types";
import {
  addConfig,
  dataSubmitApplication,
  textAddConfig,
} from "./config/addConfig";
import { VerificationPayrollOrnBonus } from "../steps/verification";
import {
  IMethodOfDisbursement,
  IPersonalInfo,
} from "../steps/verification/types";
import { IAllEnumsResponse } from "@src/services/enumerators/types";

interface BonusUIProps {
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
  isTablet: boolean;
  currentStepsNumber?: IStepDetails;
  assistedButtonText: string;
  codeError: number | null;
  prospectData: IProspect;
  formData: IFormData;
  onAmountChange: (amount: string) => void;
  onValidationChange: (isValid: boolean) => void;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormChange: (updatedValues: Partial<IBonusFormData>) => void;
  showErrorModal: boolean;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  messageError: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setProspectData: React.Dispatch<React.SetStateAction<IProspect>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onRequirementsValidated: (requirements: IValidateRequirement[]) => void;
  showSubmitModal: boolean;
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  showInfoModal: boolean;
  setShowInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingSubmit: boolean;
  handleSubmitBonus: () => void;
  validateRequirements: IValidateRequirement[];
  handleSubmitClick: () => void;
  isLoading: boolean;
  lang: EnumType;
  errorsManager: IManageErrors;
  handleSuccessModalClose: () => void;
  setIsModalOpenRequirements: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpenRequirements: boolean;
  handleNextClick: () => void;
  handleCancelNavigation: () => void;
  showExceedQuotaModal: boolean;
  setShowExceedQuotaModal: React.Dispatch<React.SetStateAction<boolean>>;
  enums: IAllEnumsResponse;
}

export function PayrollSpecialBenefitAdvanceCreditUI(props: BonusUIProps) {
  const {
    handleNextStep,
    handlePreviousStep,
    handleCancelNavigation,
    handleNextClick,
    validateRequirements,
    setCurrentStep,
    navigate,
    prospectData,
    currentStepsNumber,
    handleFormChange,
    businessUnitPublicCode,
    businessManagerCode,
    steps,
    isCurrentFormValid,
    isMobile,
    isTablet,
    codeError,
    assistedButtonText,
    customerData,
    formData,
    onAmountChange,
    onValidationChange,
    setIsCurrentFormValid,
    showErrorModal,
    setShowErrorModal,
    messageError,
    onRequirementsValidated,
    showInfoModal,
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
    lang,
    enums,
    isLoading,
    errorsManager,
    showExceedQuotaModal,
    setShowExceedQuotaModal,
  } = props;

  return (
    <>
      {codeError ? (
        <ErrorPage
          onClick={() => navigate("/clients/select-client/")}
          errorCode={codeError}
        />
      ) : (
        <Stack
          direction="column"
          width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
          margin={`0px auto ${isMobile ? "100px" : "60px"} auto`}
        >
          <Stack
            direction="column"
            alignItems={isMobile ? "normal" : "center"}
            margin="20px 0px"
          >
            <Stack gap="24px" direction="column" height="100%" width="100%">
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
                    stepsToApplyForPayrollAdvanceCredit.generalInformation
                      .id && (
                    <RequirementsNotMet
                      isMobile={isMobile}
                      prospectData={prospectData}
                      customerData={customerData}
                      businessUnitPublicCode={businessUnitPublicCode}
                      businessManagerCode={businessManagerCode}
                      onRequirementsValidated={onRequirementsValidated}
                      setShowErrorModal={setShowErrorModal}
                      lang={lang}
                      enums={enums}
                    />
                  )}

                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsToApplyForPayrollAdvanceCredit.destination.id && (
                    <RequestedValue
                      initialAmount={formData.requestedValue}
                      onValidationChange={onValidationChange}
                      onAmountChange={onAmountChange}
                      isMobile={isMobile}
                      onExceedQuota={() => setShowExceedQuotaModal(true)}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsToApplyForPayrollAdvanceCredit.methodOfDisbursement
                      .id && (
                    <DisbursementGeneral
                      isMobile={isMobile}
                      isTablet={isTablet}
                      onFormValid={setIsCurrentFormValid}
                      initialValues={
                        formData.disbursementGeneral as IDisbursementGeneral
                      }
                      handleOnChange={(values) =>
                        handleFormChange({ disbursementGeneral: values })
                      }
                      data={prospectData}
                      customerData={customerData}
                      identificationNumber={customerData?.publicCode || ""}
                    />
                  )}

                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsToApplyForPayrollAdvanceCredit.verification.id && (
                    <VerificationPayrollOrnBonus
                      setCurrentStep={setCurrentStep}
                      advanceType="bonus"
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
                  {textAddConfig.buttonPrevious}
                </Button>
                <Button
                  onClick={
                    currentStepsNumber?.id ===
                    stepsToApplyForPayrollAdvanceCredit.verification.id
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
              title={textAddConfig.submitRequestTitle}
              handleBack={() => setShowSubmitModal(false)}
              handleNext={handleSubmitBonus}
              disabledNext={false}
              backButton={textAddConfig.submitRequestCancel}
              nextButton={textAddConfig.submitRequestConfirm}
              apparenceNext="primary"
              width={isMobile ? "300px" : "500px"}
              isLoading={isLoadingSubmit}
            >
              <Text>{textAddConfig.submitRequestQuestion}</Text>
            </BaseModal>
          )}
          {isModalOpenRequirements && (
            <RequirementsModal
              handleClose={() => setIsModalOpenRequirements(false)}
              isMobile={isMobile}
              isLoading={isLoading}
              validateRequirements={validateRequirements}
              errorsManager={errorsManager}
              lang={lang}
            />
          )}
          {showSuccessModal && (
            <BaseModal
              title={textAddConfig.successModalTitle}
              handleBack={() => setShowSuccessModal(false)}
              handleNext={handleSuccessModalClose}
              disabledNext={false}
              nextButton={textAddConfig.successModalButton}
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
                    {dataSubmitApplication.modals.fileDescription}
                  </Text>
                  <Text type="body" size="large" weight="bold">
                    {dataSubmitApplication.modals.code}
                  </Text>
                </Stack>

                <Text type="body" size="medium" appearance="gray">
                  {dataSubmitApplication.modals.descriptionSolid}
                </Text>
              </Stack>
            </BaseModal>
          )}
          {showInfoModal && (
            <BaseModal
              title={dataSubmitApplication.return.title}
              nextButton={dataSubmitApplication.return.sendButton}
              backButton={dataSubmitApplication.return.cancelButton}
              width={isMobile ? "auto" : "450px"}
              handleNext={handleNextClick}
              handleBack={handleCancelNavigation}
            >
              <Text type="body" size="large">
                {dataSubmitApplication.return.confirmationText}
              </Text>
            </BaseModal>
          )}
        </Stack>
      )}
      {showExceedQuotaModal && (
        <BaseModal
          title={dataSubmitApplication.showExceedQuotaModal.title}
          width={isMobile ? "300px" : "450px"}
          nextButton={dataSubmitApplication.showExceedQuotaModal.nextButton}
          handleNext={() => setShowExceedQuotaModal(false)}
          handleClose={() => setShowExceedQuotaModal(false)}
        >
          <Stack direction="column" gap="16px" alignItems="center">
            <Icon appearance="danger" icon={<MdHighlightOff />} size="78px" />
            <Text type="body" size="medium" weight="normal" appearance="dark">
              {dataSubmitApplication.showExceedQuotaModal.description}
            </Text>
          </Stack>
        </BaseModal>
      )}
    </>
  );
}
