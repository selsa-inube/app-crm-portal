import {
  MdArrowBack,
  MdOutlinePaid,
  MdOutlinePriceChange,
  MdCheckCircle,
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
import { IResponsePaymentDatesChannel } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";
import userImage from "@assets/images/userImage.jpeg";
import { EnumType } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { Fieldset } from "@components/data/Fieldset";
import { ICreditRiskBureauUpdateMethod } from "@services/creditRiskBureauQueries/types";

import { riskScoreData } from "./steps/riskScore/config";
import { GeneralHeader } from "./components/GeneralHeader";
import { ExtraordinaryInstallments } from "./steps/extraordinaryInstallments";
import { stepsAddProspect } from "./config/addProspect.config";
import {
  IFormData,
  IStep,
  IStepDetails,
  titleButtonTextAssited,
  ICreditLineTerms,
  IServicesProductSelection,
  ISourcesOfIncomeState,
  IManageErrors,
} from "./types";
import {
  StyledAnchor,
  StyledArrowBack,
  StyledContainerAssisted,
} from "./styles";
import { RequirementsNotMet } from "./steps/requirementsNotMet";
import { LoanAmount } from "./steps/loanAmount";
import { ConsolidatedCredit } from "./steps/consolidatedCredit";
import { ProductSelection } from "./steps/ProductSelection";
import { SourcesOfIncome } from "./steps/sourcesOfIncome";
import { MoneyDestination } from "./steps/MoneyDestination";
import { ObligationsFinancial } from "./steps/financialObligations";
import { LoanCondition } from "./steps/loanCondition";
import { ExtraDebtors } from "./steps/extraDebtors";
import { addConfig, textAddConfig } from "./config/addConfig";
import { CreditLimitModal } from "../prospect/components/modals/CreditLimitModal";
import { messagesError, dataSubmitApplication } from "./config/config";
import {
  AlertCapacityAnalysis,
  AlertCreditLimit,
  AlertIncome,
} from "./components/smallModals/modals";
import { IdataMaximumCreditLimitService } from "./components/CreditLimitCard/types";
import { IDataHeader } from "../simulations/types";
import { RiskScore } from "./steps/riskScore";

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
  dataHeader: IDataHeader;
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
  currentStepsNumber?: IStepDetails;
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
  isLoadingSubmit: boolean;
  isLoadingCreditLimit: boolean;
  paymentCapacity?: IPaymentCapacityResponse | null;
  businessManagerCode: string;
  allowToContinue: boolean;
  handleModalTryAgain: () => void;
  handleNavigate: () => void;
  errorsManager: IManageErrors;
  userAccount?: string;
  paymentChannel: IResponsePaymentDatesChannel[] | null;
  loadingQuestions: boolean;
  showSelectsLoanAmount: boolean;
  createdProspectModal: boolean;
  lang: EnumType;
  enums: IAllEnumsResponse;
  isLoadingUpdate: boolean;
  setCreatedProspectModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateRiskScore: (index: number, newValue: number) => Promise<void>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  bureauMethods: ICreditRiskBureauUpdateMethod[];
  handleBureauConsultation: () => Promise<void>;
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
    userAccount,
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
    prospectData,
    creditLimitData,
    totalIncome,
    creditLineTerms,
    clientPortfolio,
    obligationPayments,
    validateRequirements,
    isLoading,
    currentStep,
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
    lang,
    allowToContinue,
    handleModalTryAgain,
    sentModal,
    setSentModal,
    handleNavigate,
    prospectCode,
    errorsManager,
    paymentChannel,
    loadingQuestions,
    showSelectsLoanAmount,
    createdProspectModal,
    setCreatedProspectModal,
    isLoadingSubmit,
    enums,
    handleUpdateRiskScore,
    isLoadingUpdate,
    setMessageError,
    bureauMethods,
    handleBureauConsultation,
  } = props;
  return (
    <>
      {codeError ? (
        <ErrorPage
          onClick={handleNavigate}
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
                profileImageUrl={dataHeader.image || userImage}
              />
              <Breadcrumbs
                crumbs={addConfig.crumbs.map((crumb) => ({
                  ...crumb,
                  label: crumb.label.i18n[lang],
                }))}
              />
              <Stack justifyContent="space-between" alignItems="center">
                <StyledArrowBack onClick={() => navigate(addConfig.route)}>
                  <Stack gap="8px" alignItems="center" width="100%">
                    <Icon
                      icon={<MdArrowBack />}
                      appearance="dark"
                      size="20px"
                    />
                    <Text type="title" size={isMobile ? "small" : "large"}>
                      {addConfig.title.i18n[lang]}
                    </Text>
                  </Stack>
                </StyledArrowBack>
                <Stack gap="8px">
                  <StyledAnchor title={textAddConfig.buttonQuotas.i18n[lang]}>
                    <Icon
                      icon={<MdOutlinePriceChange />}
                      appearance="gray"
                      size="28px"
                      spacing="compact"
                      variant="outlined"
                      cursor="pointer"
                      onClick={() => {
                        if ((currentStepsNumber?.id ?? 0) >= 4) {
                          setIsCreditLimitModalOpen(true);
                        } else {
                          setIsCreditLimitWarning(true);
                        }
                      }}
                    />
                  </StyledAnchor>
                  <StyledAnchor
                    title={textAddConfig.buttonPaymentCapacity.i18n[lang]}
                  >
                    <Icon
                      icon={<MdOutlinePaid />}
                      appearance="gray"
                      size="28px"
                      spacing="compact"
                      variant="outlined"
                      cursor="pointer"
                      onClick={() => {
                        if (totalIncome === 0) {
                          setIsCapacityAnalysisWarning(true);
                        } else {
                          setIsCapacityAnalysisModal(true);
                        }
                      }}
                    />
                  </StyledAnchor>
                  <ButtonRequirements
                    onClick={() => setIsModalOpenRequirements(true)}
                    data={validateRequirements}
                  />
                </Stack>
              </Stack>
              <StyledContainerAssisted $cursorDisabled={!isCurrentFormValid}>
                <Assisted
                  step={currentStepsNumber!}
                  totalSteps={steps.length}
                  onBackClick={handlePreviousStep}
                  onNextClick={handleNextStep}
                  controls={{
                    goBackText: titleButtonTextAssited.goBackText.i18n[lang],
                    submitText: titleButtonTextAssited.submitText.i18n[lang],
                    goNextText: titleButtonTextAssited.goNextText.i18n[lang],
                  }}
                  onSubmitClick={() => setSentModal(true)}
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
                      lang={lang}
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
                      isTablet={isMobile}
                      businessManagerCode={businessManagerCode}
                      clientIdentificationNumber={customerData.publicCode}
                      lang={lang}
                      enums={enums}
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
                      loadingQuestions={loadingQuestions}
                      lang={lang}
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
                      lang={lang}
                      lineOfCreditAbbreviatedName={formData.selectedProducts[0]}
                      moneyDestinationAbbreviatedName={
                        formData.selectedDestination
                      }
                      clientIdentificationNumber={customerData.publicCode}
                      setShowErrorModal={setShowErrorModal}
                      setMessageError={setMessageError}
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
                      prospectData={prospectData}
                      lang={lang}
                      enums={enums}
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
                      prospectData={prospectData}
                      lang={lang}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id === stepsAddProspect.riskScore.id && (
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      gap="20px"
                      justifyContent="center"
                      width="100%"
                    >
                      {formData.riskScores.length === 0 && (
                        <Fieldset width="100%">
                          <Stack
                            direction="column"
                            gap="8px"
                            justifyContent="center"
                            alignItems="center"
                            height="80px"
                          >
                            <Text type="body" size="small">
                              {riskScoreData.unavailableScore.i18n[lang]}
                            </Text>
                          </Stack>
                        </Fieldset>
                      )}
                      {formData.riskScores.map((score, index) => (
                        <RiskScore
                          key={score.bureauName}
                          value={score.value}
                          date={score.date}
                          isMobile={isMobile}
                          lang={lang}
                          logo={score.bureauName}
                          isLoadingUpdate={isLoadingUpdate}
                          resetScore={handleBureauConsultation}
                          updateMethod={
                            bureauMethods.find(
                              (bureau) =>
                                bureau.bureauName === score.bureauName,
                            )?.updateCreditScoreMethod
                          }
                          handleOnChange={(newRisk) => {
                            const updatedScores = [...formData.riskScores];
                            updatedScores[index] = {
                              ...updatedScores[index],
                              value: newRisk.value,
                              date: newRisk.date,
                            };
                            handleFormDataChange("riskScores", updatedScores);
                            handleUpdateRiskScore(index, newRisk.value);
                          }}
                        />
                      ))}
                    </Stack>
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
                      lang={lang}
                      enums={enums}
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
                      lang={lang}
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
                      paymentChannel={paymentChannel}
                      showSelects={showSelectsLoanAmount}
                      lang={lang}
                    />
                  )}
                {currentStepsNumber &&
                  currentStepsNumber.id ===
                    stepsAddProspect.obligationsCollected.id &&
                  formData.loanAmountState.toggleChecked && (
                    <ConsolidatedCredit
                      initialValues={formData.consolidatedCreditSelections}
                      isMobile={isMobile}
                      onChange={(
                        items,
                        selectedValuesMap,
                        total,
                        selectedLabelsMap,
                      ) => {
                        handleFormDataChange("consolidatedCreditArray", items);
                        handleFormDataChange("consolidatedCreditSelections", {
                          ...formData.consolidatedCreditSelections,
                          selectedValues: selectedValuesMap ?? {},
                          totalCollected:
                            total ??
                            formData.consolidatedCreditSelections
                              .totalCollected,
                          selectedLabels:
                            selectedLabelsMap ??
                            formData.consolidatedCreditSelections
                              .selectedLabels ??
                            {},
                        });
                      }}
                      data={obligationPayments}
                      lang={lang}
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
                  {titleButtonTextAssited.goBackText.i18n[lang]}
                </Button>
                <Button onClick={handleNextStep} disabled={!isCurrentFormValid}>
                  {currentStep === steps[steps.length - 1].id ||
                  (currentStep === stepsAddProspect.loanAmount.id &&
                    !formData.loanAmountState.toggleChecked)
                    ? titleButtonTextAssited.submitText.i18n[lang]
                    : titleButtonTextAssited.goNextText.i18n[lang]}
                </Button>
              </Stack>
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
              {isCreditLimitModalOpen && (
                <CreditLimitModal
                  handleClose={() => setIsCreditLimitModalOpen(false)}
                  isMobile={isMobile}
                  setRequestValue={setRequestValue}
                  dataMaximumCreditLimitService={dataMaximumCreditLimitService}
                  businessUnitPublicCode={businessUnitPublicCode}
                  businessManagerCode={businessManagerCode}
                  moneyDestination={formData.selectedDestination}
                  incomeData={formData.sourcesOfIncome}
                  userAccount={userAccount as string}
                  lang={lang}
                />
              )}
              {isCreditLimitWarning && (
                <AlertCreditLimit
                  handleNext={() => setIsCreditLimitWarning(false)}
                  handleClose={() => setIsCreditLimitWarning(false)}
                  isMobile={isMobile}
                  lang={lang}
                />
              )}
              {isCapacityAnalysisModal && (
                <PaymentCapacityAnalysis
                  isMobile={isMobile}
                  handleClose={() => setIsCapacityAnalysisModal(false)}
                  paymentCapacity={paymentCapacity}
                  sourcesOfIncome={formData.sourcesOfIncome}
                  lang={lang}
                />
              )}
              {isCapacityAnalysisWarning && (
                <AlertCapacityAnalysis
                  handleNext={() => setIsCapacityAnalysisWarning(false)}
                  handleClose={() => setIsCapacityAnalysisWarning(false)}
                  isMobile={isMobile}
                  lang={lang}
                />
              )}
              {isAlertIncome && (
                <AlertIncome
                  handleNext={() => setIsAlertIncome(false)}
                  handleClose={() => setIsAlertIncome(false)}
                  isMobile={isMobile}
                  lang={lang}
                />
              )}
              {showErrorModal && (
                <ErrorModal
                  handleClose={() => {
                    if (
                      messageError === messagesError.tryLater.i18n[lang] &&
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
                  title={dataSubmitApplication.modals.filed.i18n[lang]}
                  nextButton={dataSubmitApplication.modals.continue.i18n[lang]}
                  backButton={dataSubmitApplication.modals.cancel.i18n[lang]}
                  handleBack={() => setSentModal(false)}
                  handleNext={handleSubmitClick}
                  width={isMobile ? "290px" : "402px"}
                  isLoading={isLoadingSubmit}
                >
                  <Text>{dataSubmitApplication.modals.sure.i18n[lang]}</Text>
                </BaseModal>
              )}
              {createdProspectModal && (
                <BaseModal
                  title={dataSubmitApplication.modals.filed.i18n[lang]}
                  nextButton={dataSubmitApplication.modals.cancel.i18n[lang]}
                  handleNext={() => {
                    setCreatedProspectModal(false);
                    navigate(`/credit/prospects/${prospectCode}`);
                  }}
                  handleClose={() => {
                    setCreatedProspectModal(false);
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
                        {
                          dataSubmitApplication.modals.fileDescription.i18n[
                            lang
                          ]
                        }
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
