import { useAssignmentOptions } from "./hooks/useAssignmentOptions";
import { AssignmentFormUI } from "./interface";
import { IAssignment } from "../../types";

interface AssignmentFormProps {
  assignments: IAssignment[];
  withNextButton?: boolean;
  onAssignmentsChange: (assignments: IAssignment[]) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

function AssignmentForm(props: AssignmentFormProps) {
  const { withNextButton, assignments, onAssignmentsChange, handleNextStep, handlePreviousStep } =
    props;
  const { assignmentOptions, isLoading, hasError } = useAssignmentOptions();

  return (
    <AssignmentFormUI
      withNextButton={withNextButton}
      assignmentOptions={assignmentOptions}
      isLoading={isLoading}
      hasError={hasError}
      assignments={assignments}
      onAssignmentsChange={onAssignmentsChange}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
    />
  );
}

export { AssignmentForm };
export type { AssignmentFormProps };
