import { useState } from "react";
import { Stack, Divider, Assisted } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";
import { IProspect } from "@services/prospect/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { IObligations } from "@pages/prospect/components/TableObligationsFinancial/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { stepsAddBorrower } from "./config/addBorrower.config";
import { AddBorrower } from "./steps/personalInfo";
import { FormData, IStep, StepDetails, titleButtonTextAssited } from "./types";
import { VerificationDebtorAddModal } from "./steps/verification";

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
  businessUnitPublicCode: string;
  lang: EnumType;
  businessManagerCode: string;
  financialObligationsData: {
    customerName: string;
    customerIdentificationType: string;
    customerIdentificationNumber: string;
    obligations: IObligations[];
  };
  setFinancialObligationsData: React.Dispatch<
    React.SetStateAction<IObligations[]>
  >;
  handleFormChange: (updatedValues: Partial<FormData>) => void;
  handleIncomeChange: (updatedValues: Partial<IIncomeSources>) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitClick: () => void;
  handleClose: () => void;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  customerData?: ICustomerData;
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
    businessUnitPublicCode,
    businessManagerCode,
    lang,
    financialObligationsData,
    setFinancialObligationsData,
    handleFormChange,
    handleIncomeChange,
    setCurrentStep,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    handleClose,
    setIsCurrentFormValid,
    customerData,
  } = props;

  const [totalCapitalIncome, setTotalCapitalIncome] = useState<number>(0);
  const [totalEmploymentIncome, setTotalEmploymentIncome] = useState<number>(0);
  const [totalBusinessesIncome, setTotalBusinessesIncome] = useState<number>(0);

  return (
    <BaseModal
      title={title}
      nextButton={
        currentStepsNumber === steps[3]
          ? titleButtonTextAssited.submitText
          : titleButtonTextAssited.goNextText
      }
      backButton={titleButtonTextAssited.goBackText}
      handleNext={
        currentStepsNumber === steps[3] ? handleSubmitClick : handleNextStep
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
          showCurrentStepNumber={false}
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
              customerData={customerData!}
              lang={lang}
            />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.contactInformation.id && (
            <SourceIncome
              data={incomeData}
              showEdit={false}
              onDataChange={handleIncomeChange}
              businessUnitPublicCode={businessUnitPublicCode}
              businessManagerCode={businessManagerCode}
              prospectData={prospectData}
              onCapitalTotalChange={setTotalCapitalIncome}
              onEmploymentTotalChange={setTotalEmploymentIncome}
              onBusinessesTotalChange={setTotalBusinessesIncome}
              lang={lang}
            />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.BorrowerData.id && (
            <TableFinancialObligations
              showActions={true}
              initialValues={
                financialObligationsData.obligations.length > 0
                  ? financialObligationsData.obligations
                  : []
              }
              services={false}
              handleOnChange={(values) =>
                setFinancialObligationsData(Array.isArray(values) ? values : [])
              }
              lang={lang}
            />
          )}
        {currentStepsNumber &&
          currentStepsNumber.id === stepsAddBorrower.summary.id && (
            <VerificationDebtorAddModal
              steps={{
                personalInfo: formData.personalInfo,
                incomeData: incomeData,
                financialObligations: prospectData,
              }}
              setCurrentStep={setCurrentStep}
              totalCapitalIncome={totalCapitalIncome}
              totalEmploymentIncome={totalEmploymentIncome}
              totalBusinessesIncome={totalBusinessesIncome}
              lang={lang}
            />
          )}
      </Stack>
    </BaseModal>
  );
}
