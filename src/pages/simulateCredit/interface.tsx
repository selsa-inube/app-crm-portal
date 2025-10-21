import {
  MdArrowBack,
  MdOutlinePaid,
  MdOutlinePriceChange,
  MdOutlineRule,
  MdCheckCircle,
  MdOutlineShare,
} from "react-icons/md";
import {
  Stack,
  Button,
  Assisted,
  Breadcrumbs,
  Text,
  Icon,
} from "@inubekit/inubekit";
import { useNavigate } from "react-router-dom";

import { ButtonRequirements } from "@pages/prospect/components/buttonRequirements";
import { RequirementsModal } from "@pages/prospect/components/modals/RequirementsModal";
import { ICustomerData } from "@context/CustomerContext/types";
import { IPaymentChannel, IObligations } from "@services/creditRequest/types";
import { PaymentCapacityAnalysis } from "@components/modals/PaymentCapacityAnalysis";
import {
  IIncomeSources,
  IPaymentCapacityResponse,
} from "@services/creditLimit/types";
import { ErrorPage } from "@components/layout/ErrorPage";
import { ErrorModal } from "@components/modals/ErrorModal";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { IProspect } from "@services/prospect/types";
import { IValidateRequirement } from "@services/requirement/types";
import { BaseModal } from "@components/modals/baseModal";

import { GeneralHeader } from "./components/GeneralHeader";
import { ExtraordinaryInstallments } from "./steps/extraordinaryInstallments";
import { stepsAddProspect } from "./config/addProspect.config";
import {
  IFormData,
  IStep,
  StepDetails,
  titleButtonTextAssited,
  ICreditLineTerms,
  IServicesProductSelection,
  ISourcesOfIncomeState,
} from "./types";
import { StyledArrowBack, StyledContainerAssisted } from "./styles";
import { RequirementsNotMet } from "./steps/requirementsNotMet";
import { LoanAmount } from "./steps/loanAmount";
import { ConsolidatedCredit } from "./steps/consolidatedCredit";
import { ProductSelection } from "./steps/ProductSelection";
import { SourcesOfIncome } from "./steps/sourcesOfIncome";
import { MoneyDestination } from "./steps/MoneyDestination";
import { ObligationsFinancial } from "./steps/financialObligations";
import { LoanCondition } from "./steps/loanCondition";
import { ExtraDebtors } from "./steps/extraDebtors";
import { addConfig, textAddCongfig } from "./config/addConfig";
import { CreditLimitModal } from "../prospect/components/modals/CreditLimitModal";
import { messagesError, dataSubmitApplication } from "./config/config";
import {
  AlertCapacityAnalysis,
  AlertCreditLimit,
  AlertIncome,
} from "./components/smallModals/modals";
import { IdataMaximumCreditLimitService } from "./components/CreditLimitCard/types";

interface SimulateCreditUIProps {
  setIsModalOpenRequirements: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreditLimitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreditLimitWarning: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCapacityAnalysisModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCapacityAnalysisWarning: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAlertIncome: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  requestValue: IPaymentChannel[] | undefined;
  formState: {
    type: string;
    entity: string;
    fee: string;
    balance: string;
    payment: string;
    feePaid: string;
    term: string;
    idUser: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      type: string;
      entity: string;
      fee: string;
      balance: string;
      payment: string;
      feePaid: string;
      term: string;
      idUser: string;
    }>
  >;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleSubmitClick: () => void;
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormDataChange: (
    field: keyof IFormData,
    newValue: string | number | boolean | string[] | object | null | undefined,
  ) => void;
  sentModal: boolean;
  setSentModal: React.Dispatch<React.SetStateAction<boolean>>;
  prospectCode: string;
  navigate: ReturnType<typeof useNavigate>;
  currentStep: number;
  customerData: ICustomerData;
  dataHeader: { name: string; status: string };
  steps: IStep[];
  isCurrentFormValid: boolean;
  isModalOpenRequirements: boolean;
  isCreditLimitModalOpen: boolean;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  isCreditLimitWarning: boolean;
  isCapacityAnalysisModal: boolean;
  isCapacityAnalysisWarning: boolean;
  formData: IFormData;
  selectedProducts: string[];
  isMobile: boolean;
  isTablet: boolean;
  validateRequirements: IValidateRequirement[];
  isLoading: boolean;
  currentStepsNumber?: StepDetails;
  prospectData: IProspect | undefined;
  creditLimitData?: IIncomeSources;
  totalIncome: number;
  creditLineTerms?: ICreditLineTerms;
  clientPortfolio: IObligations;
  obligationPayments: IPayment[];
  assistedButtonText: string;
  isAlertIncome: boolean;
  codeError: number | null;
  addToFix: string[];
  businessUnitPublicCode: string;
  showErrorModal: boolean;
  messageError: string;
  servicesProductSelection: IServicesProductSelection;
  isLoadingCreditLimit: boolean;
  paymentCapacity?: IPaymentCapacityResponse | null;
  businessManagerCode: string;
  allowToContinue: boolean;
  handleModalTryAgain: () => void;
}

export function SimulateCreditUI(props: SimulateCreditUIProps) {
  const {
    setIsModalOpenRequirements,
    setIsCreditLimitModalOpen,
    setIsCreditLimitWarning,
    setIsCurrentFormValid,
    setIsCapacityAnalysisModal,
    setIsCapacityAnalysisWarning,
    setIsAlertIncome,
    setRequestValue,
    requestValue,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    setShowErrorModal,
    handleFormDataChange,
    setSelectedProducts,
    navigate,
    currentStepsNumber,
    customerData,
    dataHeader,
    steps,
    isCurrentFormValid,
    isModalOpenRequirements,
    isCreditLimitModalOpen,
    isCreditLimitWarning,
    isCapacityAnalysisModal,
    dataMaximumCreditLimitService,
    isCapacityAnalysisWarning,
    formData,
    selectedProducts,
    isMobile,
    isTablet,
    prospectData,
    creditLimitData,
    totalIncome,
    creditLineTerms,
    clientPortfolio,
    obligationPayments,
    validateRequirements,
    isLoading,
    currentStep,
    assistedButtonText,
    isAlertIncome,
    codeError,
    addToFix,
    servicesProductSelection,
    formState,
    setFormState,
    paymentCapacity,
    showErrorModal,
    messageError,
    businessUnitPublicCode,
    businessManagerCode,
    isLoadingCreditLimit,
    allowToContinue,
    handleModalTryAgain,
    sentModal,
    setSentModal,
    prospectCode,
  } = props;

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
                buttonText="Agregar vinculación"
                descriptionStatus={dataHeader.status}
                name={dataHeader.name}
                profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
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
                </StyledArrowBack>
                <Stack gap="8px">
                  {isMobile ? (
                    <>
                      <Icon
                        icon={<MdOutlinePriceChange />}
                        appearance="gray"
                        size="28px"
                        spacing="compact"
                        variant="outlined"
                        onClick={() => {
                          if ((currentStepsNumber?.id ?? 0) >= 4) {
                            setIsCreditLimitModalOpen(true);
                          } else {
                            setIsCreditLimitWarning(true);
                          }
                        }}
                      />
                      <Icon
                        icon={<MdOutlinePaid />}
                        appearance="gray"
                        size="28px"
                        spacing="compact"
                        variant="outlined"
                        onClick={() => {
                          if (totalIncome === 0) {
                            setIsCapacityAnalysisWarning(true);
                          } else {
                            setIsCapacityAnalysisModal(true);
                          }
                        }}
                      />
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
                      <Button
                        iconBefore={<MdOutlinePriceChange />}
                        children={textAddCongfig.buttonQuotas}
                        appearance="gray"
                        spacing="compact"
                        variant="outlined"
                        onClick={() => {
                          if ((currentStepsNumber?.id ?? 0) >= 4) {
                            setIsCreditLimitModalOpen(true);
                          } else {
                            setIsCreditLimitWarning(true);
                          }
                        }}
                      />
                      <Button
                        spacing="compact"
                        appearance="gray"
                        iconBefore={<MdOutlinePaid />}
                        children={textAddCongfig.buttonPaymentCapacity}
                        onClick={() => {
                          if (totalIncome === 0) {
                            setIsCapacityAnalysisWarning(true);
                          } else {
                            setIsCapacityAnalysisModal(true);
                          }
                        }}
                        variant="outlined"
                      />
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
                    stepsAddProspect.generalInformation.id && (
                    <RequirementsNotMet
                      isMobile={isMobile}
                      prospectData={prospectData as IProspect}
                      customerData={customerData}
                      businessUnitPublicCode={businessUnitPublicCode}
                      businessManagerCode={businessManagerCode}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id === stepsAddProspect.destination.id && (
                    <MoneyDestination
                      initialValues={formData.selectedDestination}
                      handleOnChange={(newDestination) =>
                        handleFormDataChange(
                          "selectedDestination",
                          newDestination,
                        )
                      }
                      onFormValid={setIsCurrentFormValid}
                      isTablet={isTablet}
                      businessManagerCode={businessManagerCode}
                      clientIdentificationNumber={customerData.publicCode}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.productSelection.id && (
                    <ProductSelection
                      initialValues={{
                        selectedProducts,
                        generalToggleChecked: formData.generalToggleChecked,
                        togglesState: formData.togglesState,
                      }}
                      handleFormDataChange={handleFormDataChange}
                      handleOnChange={{
                        setSelectedProducts,
                        onGeneralToggleChange: () =>
                          handleFormDataChange(
                            "generalToggleChecked",
                            !formData.generalToggleChecked,
                          ),
                        onToggleChange: (index: number) => {
                          const newToggles = [...formData.togglesState];
                          newToggles[index] = !newToggles[index];
                          handleFormDataChange("togglesState", newToggles);
                        },
                      }}
                      onFormValid={setIsCurrentFormValid}
                      isMobile={isMobile}
                      choiceMoneyDestination={formData.selectedDestination}
                      servicesQuestion={{
                        financialObligation:
                          servicesProductSelection.financialObligation,
                        aditionalBorrowers:
                          servicesProductSelection.aditionalBorrowers,
                        extraInstallement:
                          servicesProductSelection.extraInstallement,
                      }}
                      creditLineTerms={creditLineTerms!}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.extraordinaryInstallments.id && (
                    <ExtraordinaryInstallments
                      isMobile={isMobile}
                      initialValues={formData.extraordinaryInstallments}
                      businessManagerCode={businessManagerCode}
                      handleOnChange={(newExtraordinary) =>
                        handleFormDataChange(
                          "extraordinaryInstallments",
                          newExtraordinary,
                        )
                      }
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.extraBorrowers.id &&
                  formData.borrowerData.borrowers.length > 0 && (
                    <ExtraDebtors
                      initialValues={formData.borrowerData.borrowers}
                      onFormValid={setIsCurrentFormValid}
                      handleOnChange={(newDestination) => {
                        handleFormDataChange("borrowerData", newDestination);
                      }}
                      isMobile={isMobile}
                      customerData={customerData}
                      businessUnitPublicCode={businessUnitPublicCode}
                      businessManagerCode={businessManagerCode}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.sourcesIncome.id && (
                    <SourcesOfIncome
                      isLoadingCreditLimit={isLoadingCreditLimit}
                      initialValues={formData.sourcesOfIncome}
                      handleOnChange={(
                        newState: Partial<ISourcesOfIncomeState>,
                      ) => {
                        handleFormDataChange("sourcesOfIncome", {
                          ...formData.sourcesOfIncome,
                          ...newState,
                        });
                      }}
                      isMobile={isMobile}
                      customerData={customerData}
                      creditLimitData={creditLimitData}
                      businessUnitPublicCode={businessUnitPublicCode}
                      businessManagerCode={businessManagerCode}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.obligationsFinancial.id && (
                    <ObligationsFinancial
                      isMobile={isMobile}
                      initialValues={formData.obligationsFinancial}
                      clientPortfolio={clientPortfolio}
                      setFormState={setFormState}
                      formState={formState}
                      onFormValid={setIsCurrentFormValid}
                      handleOnChange={(newObligation) =>
                        handleFormDataChange(
                          "obligationsFinancial",
                          newObligation,
                        )
                      }
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.loanConditions.id && (
                    <LoanCondition
                      initialValues={formData.loanConditionState}
                      handleOnChange={(
                        newState: Partial<typeof formData.loanConditionState>,
                      ) =>
                        handleFormDataChange("loanConditionState", {
                          ...formData.loanConditionState,
                          ...newState,
                        })
                      }
                      onFormValid={setIsCurrentFormValid}
                      isMobile={isMobile}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id === stepsAddProspect.loanAmount.id && (
                    <LoanAmount
                      initialValues={formData.loanAmountState}
                      handleOnChange={(
                        newData: Partial<typeof formData.loanAmountState>,
                      ) =>
                        handleFormDataChange("loanAmountState", {
                          ...formData.loanAmountState,
                          ...newData,
                        })
                      }
                      onFormValid={setIsCurrentFormValid}
                      isMobile={isMobile}
                      requestValue={requestValue}
                      setRequestValue={setRequestValue}
                      obligationPayments={obligationPayments}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.obligationsCollected.id &&
                  formData.loanAmountState.toggleChecked && (
                    <ConsolidatedCredit
                      initialValues={formData.consolidatedCreditSelections}
                      isMobile={isMobile}
                      onChange={(items) =>
                        handleFormDataChange("consolidatedCreditArray", items)
                      }
                      data={obligationPayments}
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
                  {titleButtonTextAssited.goBackText}
                </Button>
                <Button onClick={handleNextStep} disabled={!isCurrentFormValid}>
                  {currentStep === steps[steps.length - 1].id ||
                  (currentStep === stepsAddProspect.loanAmount.id &&
                    !formData.loanAmountState.toggleChecked)
                    ? titleButtonTextAssited.submitText
                    : titleButtonTextAssited.goNextText}
                </Button>
              </Stack>
              {isModalOpenRequirements && (
                <RequirementsModal
                  handleClose={() => setIsModalOpenRequirements(false)}
                  isMobile={isMobile}
                  isLoading={isLoading}
                  validateRequirements={validateRequirements}
                />
              )}
              {isCreditLimitModalOpen && (
                <CreditLimitModal
                  handleClose={() => setIsCreditLimitModalOpen(false)}
                  isMobile={isMobile}
                  setRequestValue={setRequestValue}
                  dataMaximumCreditLimitService={dataMaximumCreditLimitService}
                  businessUnitPublicCode={businessUnitPublicCode}
                  businessManagerCode={businessManagerCode}
                />
              )}
              {isCreditLimitWarning && (
                <AlertCreditLimit
                  handleNext={() => setIsCreditLimitWarning(false)}
                  handleClose={() => setIsCreditLimitWarning(false)}
                  isMobile={isMobile}
                />
              )}
              {isCapacityAnalysisModal && (
                <PaymentCapacityAnalysis
                  isMobile={isMobile}
                  handleClose={() => setIsCapacityAnalysisModal(false)}
                  paymentCapacity={paymentCapacity}
                  sourcesOfIncome={formData.sourcesOfIncome}
                />
              )}
              {isCapacityAnalysisWarning && (
                <AlertCapacityAnalysis
                  handleNext={() => setIsCapacityAnalysisWarning(false)}
                  handleClose={() => setIsCapacityAnalysisWarning(false)}
                  isMobile={isMobile}
                />
              )}
              {isAlertIncome && (
                <AlertIncome
                  handleNext={() => setIsAlertIncome(false)}
                  handleClose={() => setIsAlertIncome(false)}
                  isMobile={isMobile}
                />
              )}
              {showErrorModal && (
                <ErrorModal
                  handleClose={() => {
                    if (
                      messageError === messagesError.tryLater &&
                      !allowToContinue
                    ) {
                      handleModalTryAgain();
                    }
                    setShowErrorModal(false);
                  }}
                  isMobile={isMobile}
                  message={messageError}
                />
              )}
              {sentModal && (
                <BaseModal
                  title={dataSubmitApplication.modals.filed}
                  nextButton={dataSubmitApplication.modals.cancel}
                  handleNext={() => {
                    setSentModal(false);
                    navigate(`/credit/prospects/${prospectCode}`);
                  }}
                  handleClose={() => {
                    setSentModal(false);
                    navigate(`/credit/prospects/${prospectCode}`);
                  }}
                  width={isMobile ? "290px" : "402px"}
                >
                  <Stack direction="column" alignItems="center" gap="24px">
                    <Icon
                      icon={<MdCheckCircle />}
                      appearance="success"
                      size="68px"
                    />
                    <Stack gap="6px">
                      <Text type="body" size="large">
                        {dataSubmitApplication.modals.filed}
                      </Text>
                      <Text type="body" size="large" weight="bold">
                        {prospectCode}
                      </Text>
                    </Stack>
                  </Stack>
                </BaseModal>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
}
