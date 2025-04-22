import { Assisted } from "@inubekit/assisted";
import { Stack, Divider } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/incomeSources/types";

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
  handleFormChange: (updatedValues: Partial<FormData>) => void;
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
    handleFormChange,
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
      handleNext={handleNextStep}
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
            />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.contactInformation.id && (
            <SourceIncome data={incomeData} showEdit={false} />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.BorrowerData.id && (
            <TableFinancialObligations showActions={true} />
          )}
      </Stack>
    </BaseModal>
  );
}
