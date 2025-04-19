import { useState } from "react";
import { Stack, Button, useMediaQuery, IOption, Spinner } from "@inubekit/inubekit";
import { MdOutlineAdd } from "react-icons/md";

import { spacing } from "@design/tokens/spacing";
import { AssignmentCard } from "@components/data/AssignmentCard";
import { currencyFormat } from "@utils/forms/currency";

import { AddAssignmentModal } from "./modals/AddAssignmentModal";
import { FormValues } from "./modals/AddAssignmentModal/types";
import { StyledContainer } from "./styles";
import { IAssignment } from "../../types";

interface AssignmentFormUIProps {
  assignmentOptions: IOption[];
  assignments: IAssignment[];
  withNextButton?: boolean;
  isLoading?: boolean;
  hasError?: number | null;
  onAssignmentsChange: (assignments: IAssignment[]) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

function AssignmentFormUI(props: AssignmentFormUIProps) {
  const {
    withNextButton,
    assignments,
    assignmentOptions = [],
    isLoading = false,
    hasError,
    onAssignmentsChange,
    handleNextStep,
    handlePreviousStep,
  } = props;

  const isMobile = useMediaQuery("(max-width: 600px)");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitAssignment = (values: FormValues) => {
    const selectedOption = assignmentOptions.find((option) => option.id === values.assignment);

    const newAssignment: IAssignment = {
      title: `Asignación ${assignments.length + 1}`,
      assignment: selectedOption?.label ?? values.assignment,
      value: currencyFormat(values.value),
    };

    onAssignmentsChange([...assignments, newAssignment]);
    handleCloseModal();
  };

  return (
    <form>
      <Stack direction="column" gap={isMobile ? spacing.s300 : spacing.s400}>
        <StyledContainer $isMobile={isMobile}>
          {isLoading ? (
            <Stack justifyContent="center" alignItems="center" width="100%" padding={spacing.s400}>
              <Spinner size="medium" />
            </Stack>
          ) : (
            <Stack direction="column" width="100%" gap={spacing.s250} alignItems="flex-end">
              <Button
                cursorHover
                iconBefore={<MdOutlineAdd />}
                fullwidth={isMobile}
                onClick={handleOpenModal}
                disabled={!!hasError}
              >
                Agregar asignación
              </Button>
              <Stack
                width="100%"
                gap={spacing.s250}
                wrap="wrap"
                justifyContent={isMobile ? "center" : "flex-start"}
              >
                {assignments.map((item, index) => (
                  <AssignmentCard
                    key={index}
                    title={item.title}
                    assignment={item.assignment}
                    value={item.value}
                    isMobile={isMobile}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </StyledContainer>

        {withNextButton && (
          <Stack justifyContent="flex-end" gap={spacing.s250}>
            <Button
              onClick={handlePreviousStep}
              appearance="gray"
              variant="outlined"
              disabled={isLoading}
            >
              Anterior
            </Button>
            <Button onClick={handleNextStep} disabled={isLoading}>
              Siguiente
            </Button>
          </Stack>
        )}
      </Stack>

      {isModalOpen && (
        <AddAssignmentModal
          onCloseModal={handleCloseModal}
          onSubmit={handleSubmitAssignment}
          assignmentOptions={assignmentOptions}
        />
      )}
    </form>
  );
}

export { AssignmentFormUI };
