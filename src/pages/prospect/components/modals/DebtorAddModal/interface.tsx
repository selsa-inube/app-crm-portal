import { Stack, Divider, Assisted } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/getIncomeSources/types";
import { IProspect } from "@services/types";

import { stepsAddBorrower } from "./config/addBorrower.config";
import { AddBorrower } from "./steps/personalInfo";
import { FormData, IStep, StepDetails, titleButtonTextAssited } from "./types";

interface DebtorAddModalUIProps {
  currentStep: number;
  currentStepsNumber: StepDetails;
  steps: IStep[];
  isCurrentFormValid: boolean;
  formData: FormData;
  title: string;
  isMobile: boolean;
  incomeData: IIncomeSources | undefined;
  AutoCompleted: boolean;
  prospectData: IProspect;
  handleFormChange: (updatedValues: Partial<FormData>) => void;
  handleIncomeChange: (updatedValues: Partial<IIncomeSources>) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitClick: () => void;
  handleClose: () => void;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DebtorAddModalUI(props: DebtorAddModalUIProps) {
  const {
    currentStepsNumber,
    steps,
    isCurrentFormValid,
    formData,
    title,
    isMobile,
    incomeData,
    AutoCompleted,
    prospectData,
    handleFormChange,
    handleIncomeChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    handleClose,
    setIsCurrentFormValid,
  } = props;

  return (
    <BaseModal
      title={title}
      nextButton={
        currentStepsNumber === steps[2]
          ? titleButtonTextAssited.submitText
          : titleButtonTextAssited.goNextText
      }
      backButton={titleButtonTextAssited.goBackText}
      handleNext={
        currentStepsNumber === steps[2] ? handleSubmitClick : handleNextStep
      }
      handleBack={handlePreviousStep}
      handleClose={handleClose}
      disabledNext={!isCurrentFormValid}
      disabledBack={currentStepsNumber === steps[0]}
      finalDivider={true}
      width={isMobile ? "290px" : "950px"}
      height="100%"
    >
      <Stack direction="column" gap="16px">
        <Assisted
          step={currentStepsNumber!}
          totalSteps={steps.length}
          onBackClick={handlePreviousStep}
          onNextClick={handleNextStep}
          controls={titleButtonTextAssited}
          onSubmitClick={handleSubmitClick}
          disableNext={!isCurrentFormValid}
          disableSubmit={!isCurrentFormValid}
          size={isMobile ? "small" : "large"}
        />
        <Divider />
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.generalInformation.id && (
            <AddBorrower
              title="Información personal"
              initialValues={formData.personalInfo}
              onFormValid={setIsCurrentFormValid}
              handleOnChange={(values) =>
                handleFormChange({ personalInfo: values })
              }
              AutoCompleted={AutoCompleted}
            />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.contactInformation.id && (
            <SourceIncome
              data={incomeData}
              showEdit={false}
              onDataChange={handleIncomeChange}
            />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.BorrowerData.id && (
            <TableFinancialObligations
              showActions={true}
              initialValues={prospectData}
            />
          )}
      </Stack>
    </BaseModal>
  );
}
