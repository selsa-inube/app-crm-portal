import { AlertCardProps } from "@components/data/AlertCard";

import { UnmetRequirementsFormUI } from "./interface";

interface UnmetRequirementsFormProps {
  alertCards?: AlertCardProps[];
  withNextButton?: boolean;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

function UnmetRequirementsForm(props: UnmetRequirementsFormProps) {
  const { alertCards, withNextButton, handleNextStep, handlePreviousStep } = props;
  return (
    <UnmetRequirementsFormUI
      alertCards={alertCards}
      withNextButton={withNextButton}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
    />
  );
}

export { UnmetRequirementsForm };
export type { UnmetRequirementsFormProps };
