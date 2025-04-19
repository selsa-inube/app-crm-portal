import { useState } from "react";
import { Assisted, IAssistedStep, Stack, useMediaQuery, Text, Button } from "@inubekit/inubekit";
import { FormikProps } from "formik";
import { MdCheckCircleOutline } from "react-icons/md";

import { spacing } from "@design/tokens/spacing";
import { mockAlertCards } from "@mocks/requirements/requirements.mock";
import { AlertCardProps } from "@components/data/AlertCard";

import { PersonalDataForm } from "./forms/PersonalDataForm";
import { ContractualPositionDataForm } from "./forms/ContractualPositionDataForm";
import { LegalAccountingLocationForm } from "./forms/LegalAccountingLocationForm";
import { RequirementsModal } from "./modals/RequirementsModal";
import { IPersonalDataEntry } from "./forms/PersonalDataForm/types";
import { IContractualPositionData } from "./forms/ContractualPositionDataForm/types";
import { ILegalAccountingLocation } from "./forms/LegalAccountingLocationForm/types";
import { UnmetRequirementsForm } from "./forms/UnmetRequirementsForm";
import { AssignmentForm } from "./forms/AssignmentForm";
import { IAssignment } from "./types";
import { VerificationForm } from "./forms/VerificationForm";

interface NewEmployeeUIProps {
  steps: IAssistedStep[];
  currentStep: number;
  isCurrentFormValid: boolean;
  personalDataRef: React.RefObject<FormikProps<IPersonalDataEntry>>;
  initialPersonalDataValues: IPersonalDataEntry;
  contractualPositionDataFormRef: React.RefObject<FormikProps<IContractualPositionData>>;
  initialContractualPositionValues: IContractualPositionData;
  legalAccountingLocationFormRef: React.RefObject<FormikProps<ILegalAccountingLocation>>;
  initialLegalAccountingLocationValues: ILegalAccountingLocation;
  assignments: IAssignment[];
  requirements: AlertCardProps[];
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onAssignmentsChange: (assignments: IAssignment[]) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleFinishAssisted: () => void;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewEmployeeUI(props: NewEmployeeUIProps) {
  const {
    steps,
    currentStep,
    isCurrentFormValid,
    personalDataRef,
    initialPersonalDataValues,
    contractualPositionDataFormRef,
    initialContractualPositionValues,
    legalAccountingLocationFormRef,
    initialLegalAccountingLocationValues,
    assignments,
    requirements,
    setCurrentStep,
    onAssignmentsChange,
    handleNextStep,
    handlePreviousStep,
    handleFinishAssisted,
    setIsCurrentFormValid,
  } = props;

  const isTablet = useMediaQuery("(max-width: 1100px)");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Stack
        direction="column"
        gap={isTablet ? spacing.s300 : spacing.s500}
        margin={isTablet ? `${spacing.s300} ${spacing.s200}` : `${spacing.s400} ${spacing.s800}`}
      >
        <Text type="title" as="h1" size={isTablet ? "medium" : "large"}>
          Vinculación de un empleado nuevo
        </Text>
        <Assisted
          step={steps[currentStep - 1]}
          totalSteps={steps.length}
          disableNext={!isCurrentFormValid}
          size={isTablet ? "small" : "large"}
          controls={{
            goBackText: "Anterior",
            goNextText: "Siguiente",
            submitText: "Finalizar",
          }}
          onNextClick={handleNextStep}
          onBackClick={handlePreviousStep}
          onSubmitClick={handleFinishAssisted}
        />

        <Stack direction="column">
          <Stack direction="column" alignItems="flex-end" margin={spacing.s075}>
            <Button
              appearance="gray"
              variant="outlined"
              spacing="compact"
              iconBefore={<MdCheckCircleOutline />}
              onClick={handleOpenModal}
            >
              Requisitos
            </Button>
          </Stack>

          {currentStep === 1 && (
            <PersonalDataForm
              ref={personalDataRef}
              initialValues={initialPersonalDataValues}
              withNextButton={true}
              onFormValid={setIsCurrentFormValid}
              handleNextStep={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <ContractualPositionDataForm
              ref={contractualPositionDataFormRef}
              initialValues={initialContractualPositionValues}
              withNextButton={true}
              onFormValid={setIsCurrentFormValid}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}

          {currentStep === 3 && (
            <LegalAccountingLocationForm
              ref={legalAccountingLocationFormRef}
              initialValues={initialLegalAccountingLocationValues}
              withNextButton={true}
              onFormValid={setIsCurrentFormValid}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}
          {currentStep === 4 && (
            <AssignmentForm
              withNextButton={true}
              assignments={assignments}
              onAssignmentsChange={onAssignmentsChange}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}
          {currentStep === 5 && (
            <UnmetRequirementsForm
              alertCards={requirements}
              withNextButton={true}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}
          {currentStep === 6 && (
            <VerificationForm
              updatedData={{
                personalInformation: {
                  isValid: personalDataRef.current?.isValid ?? false,
                  values: personalDataRef.current?.values ?? initialPersonalDataValues,
                },
                contractualPositionData: {
                  isValid: contractualPositionDataFormRef.current?.isValid ?? false,
                  values:
                    contractualPositionDataFormRef.current?.values ??
                    initialContractualPositionValues,
                },
                legalAccountingLocation: {
                  isValid: legalAccountingLocationFormRef.current?.isValid ?? false,
                  values:
                    legalAccountingLocationFormRef.current?.values ??
                    initialLegalAccountingLocationValues,
                },
                assignmentForm: {
                  isValid: true,
                  values: assignments,
                },
                unmetRequirements: {
                  isValid: true,
                  values: requirements,
                },
              }}
              handleStepChange={(stepId) => setCurrentStep(stepId)}
              handlePreviousStep={handlePreviousStep}
              handleSubmit={handleFinishAssisted}
            />
          )}
        </Stack>
      </Stack>

      {isModalOpen && (
        <RequirementsModal alertCards={mockAlertCards} onCloseModal={handleCloseModal} />
      )}
    </>
  );
}

export { NewEmployeeUI };
