import { FormikProps } from "formik";
import { Stack, Assisted, IAssistedStep, useMediaQuery } from "@inubekit/inubekit";

import { AppMenu } from "@components/layout/AppMenu";
import { IRoute } from "@components/layout/AppMenu/types";
import { spacing } from "@design/tokens/spacing";

import { GeneralInformationForm } from "./forms/GeneralInformationForm";
import { IGeneralInformationEntry } from "./forms/GeneralInformationForm/types";
import { VerificationForm } from "./forms/VerificationForm";
import { AlertCardStep } from "./forms/RequirementsForm";

interface RequestPaymentUIProps {
  appName: string;
  appRoute: IRoute[];
  navigatePage: string;
  steps: IAssistedStep[];
  currentStep: number;
  generalInformationRef: React.RefObject<FormikProps<IGeneralInformationEntry>>;
  initialGeneralInformationValues: IGeneralInformationEntry;
  isCurrentFormValid: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleFinishAssisted: () => void;
}

function RequestPaymentUI(props: RequestPaymentUIProps) {
  const {
    appName,
    appRoute,
    navigatePage,
    steps,
    currentStep,
    generalInformationRef,
    initialGeneralInformationValues,
    isCurrentFormValid,
    setCurrentStep,
    setIsCurrentFormValid,
    handleNextStep,
    handlePreviousStep,
    handleFinishAssisted,
  } = props;

  const isTablet = useMediaQuery("(max-width: 1100px)");

  return (
    <AppMenu appName={appName} appRoute={appRoute} navigatePage={navigatePage}>
      <Stack direction="column" gap={spacing.s500}>
        <Assisted
          step={steps[currentStep - 1]}
          totalSteps={steps.length}
          onNextClick={handleNextStep}
          onBackClick={handlePreviousStep}
          onSubmitClick={handleFinishAssisted}
          disableNext={!isCurrentFormValid}
          size={isTablet ? "small" : "large"}
          controls={{
            goBackText: "Anterior",
            goNextText: "Siguiente",
            submitText: "Enviar",
          }}
        />
        <Stack direction="column" gap={spacing.s500}>
          {currentStep === 1 && (
            <GeneralInformationForm
              ref={generalInformationRef}
              initialValues={initialGeneralInformationValues}
              withNextButton={true}
              onFormValid={setIsCurrentFormValid}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 2 && (
            <AlertCardStep
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 3 && (
            <VerificationForm
              updatedData={{
                personalInformation: {
                  isValid: isCurrentFormValid,
                  values: initialGeneralInformationValues,
                },
              }}
              handleStepChange={(stepId) => setCurrentStep(stepId)}
              handlePreviousStep={handlePreviousStep}
              handleSubmit={handleFinishAssisted}
            />
          )}
        </Stack>
      </Stack>
    </AppMenu>
  );
}

export { RequestPaymentUI };
