import {
  MdArrowBack,
  MdOutlinePaid,
  MdOutlinePriceChange,
  MdOutlineRule,
} from "react-icons/md";
import {
  Stack,
  Button,
  Assisted,
  Breadcrumbs,
  Text,
  Icon,
} from "@inubekit/inubekit";

import { ButtonRequirements } from "@pages/prospect/components/buttonRequirements";
import { RequirementsModal } from "@pages/prospect/components/modals/RequirementsModal";
import { extraordinaryInstallmentMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { ICustomerData } from "@context/CustomerContext/types";
import { IPaymentChannel } from "@services/types";

import { GeneralHeader } from "./components/GeneralHeader";
import { ExtraordinaryInstallments } from "./steps/extraordinaryInstallments";
import { stepsAddProspect } from "./config/addProspect.config";
import { IFormData, IStep, StepDetails, titleButtonTextAssited } from "./types";
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
import { PaymentCapacityAnalysis } from "@src/components/modals/PaymentCapacityAnalysis";

interface AddPositionUIProps {
  setIsModalOpenRequirements: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreditLimitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCapacityAnalysisModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  requestValue: IPaymentChannel[] | undefined;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleSubmitClick: () => void;
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFormDataChange: (field: string, newValue: any) => void;
  getRuleByName: (name: string) => string[];
  getAllDataRuleByName: (name: string) => string[];
  currentStep: number;
  customerData: ICustomerData;
  dataHeader: { name: string; status: string };
  steps: IStep[];
  isCurrentFormValid: boolean;
  isModalOpenRequirements: boolean;
  isCreditLimitModalOpen: boolean;
  isCapacityAnalysisModal: boolean;
  formData: IFormData;
  selectedProducts: string[];
  isMobile: boolean;
  isTablet: boolean;
  currentStepsNumber?: StepDetails;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prospectData: any;
}

export function AddProspectUI(props: AddPositionUIProps) {
  const {
    setIsModalOpenRequirements,
    setIsCreditLimitModalOpen,
    setIsCurrentFormValid,
    setIsCapacityAnalysisModal,
    setRequestValue,
    requestValue,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    handleFormDataChange,
    setSelectedProducts,
    getRuleByName,
    getAllDataRuleByName,
    currentStepsNumber,
    customerData,
    dataHeader,
    steps,
    isCurrentFormValid,
    isModalOpenRequirements,
    isCreditLimitModalOpen,
    isCapacityAnalysisModal,
    formData,
    selectedProducts,
    isMobile,
    isTablet,
    prospectData,
  } = props;

  return (
    <Stack
      direction="column"
      width={isMobile ? "-webkit-fill-available" : "min(100%,1064px)"}
      margin="0 auto"
    >
      <Stack
        direction="column"
        alignItems={isMobile ? "normal" : "center"}
        margin="20px 0px"
        padding="24px"
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
            <StyledArrowBack>
              <Stack gap="8px" alignItems="center" width="100%">
                <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
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
                    onClick={() => setIsCreditLimitModalOpen(true)}
                  />
                  <Icon
                    icon={<MdOutlinePaid />}
                    appearance="gray"
                    size="28px"
                    spacing="compact"
                    variant="outlined"
                    onClick={() => setIsCapacityAnalysisModal(true)}
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
                    onClick={() => setIsCreditLimitModalOpen(true)}
                  />
                  <Button
                    spacing="compact"
                    appearance="gray"
                    iconBefore={<MdOutlinePaid />}
                    children={textAddCongfig.buttonPaymentCapacity}
                    onClick={() => setIsCapacityAnalysisModal(true)}
                    variant="outlined"
                  />
                  <ButtonRequirements
                    onClick={() => setIsModalOpenRequirements(true)}
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
              controls={titleButtonTextAssited}
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
                  prospectData={prospectData}
                  customerData={customerData}
                />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id === stepsAddProspect.destination.id && (
                <MoneyDestination
                  initialValues={formData.selectedDestination}
                  handleOnChange={(newDestination) =>
                    handleFormDataChange("selectedDestination", newDestination)
                  }
                  onFormValid={setIsCurrentFormValid}
                  isTablet={isTablet}
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
                  allRules={{
                    lineOfCredit: getAllDataRuleByName("LineOfCredit"),
                    PercentagePayableViaExtraInstallments: getRuleByName(
                      "PercentagePayableViaExtraInstallments",
                    ),
                    IncomeSourceUpdateAllowed: getRuleByName(
                      "IncomeSourceUpdateAllowed",
                    ),
                  }}
                />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id ===
                stepsAddProspect.extraordinaryInstallments.id && (
                <ExtraordinaryInstallments
                  dataTable={extraordinaryInstallmentMock}
                  isMobile={isMobile}
                />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id === stepsAddProspect.extraBorrowers.id && (
                <ExtraDebtors
                  initialValues={formData.borrowerData}
                  onFormValid={setIsCurrentFormValid}
                  handleOnChange={(newDestination) =>
                    handleFormDataChange("borrowerData", newDestination)
                  }
                  isMobile={isMobile}
                />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id === stepsAddProspect.sourcesIncome.id && (
                <SourcesOfIncome
                  isMobile={isMobile}
                  customerData={customerData}
                />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id ===
                stepsAddProspect.obligationsFinancial.id && (
                <ObligationsFinancial isMobile={isMobile} />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id === stepsAddProspect.loanConditions.id && (
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
                />
              )}
            {currentStepsNumber &&
              currentStepsNumber.id ===
                stepsAddProspect.obligationsCollected.id && (
                <ConsolidatedCredit
                  initialValues={formData.consolidatedCreditSelections}
                  isMobile={isMobile}
                  onChange={(items) =>
                    handleFormDataChange("consolidatedCreditArray", items)
                  }
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
              {currentStepsNumber === steps[9]
                ? titleButtonTextAssited.submitText
                : titleButtonTextAssited.goNextText}
            </Button>
          </Stack>
          {isModalOpenRequirements && (
            <RequirementsModal
              handleClose={() => setIsModalOpenRequirements(false)}
              isMobile={isMobile}
              prospectData={prospectData}
              customerData={customerData}
            />
          )}
          {isCreditLimitModalOpen && (
            <CreditLimitModal
              handleClose={() => setIsCreditLimitModalOpen(false)}
              isMobile={isMobile}
              setRequestValue={setRequestValue}
            />
          )}
          {isCapacityAnalysisModal && (
            <PaymentCapacityAnalysis
              isMobile={isMobile}
              handleClose={() => setIsCapacityAnalysisModal(false)}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
