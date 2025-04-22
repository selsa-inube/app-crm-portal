import { MdCheckCircleOutline } from "react-icons/md";
import { Button } from "@inubekit/inubekit";

import { mockRequirementsNotMet } from "@mocks/requirements-not-met/requirementsnotmet.mock";

import { StyledButton } from "./styles";
import { dataButtonRequirements } from "./config";

interface IButtonRequirementsProps {
  onClick: () => void;
}

export function ButtonRequirements(props: IButtonRequirementsProps) {
  const { onClick } = props;

  const dataCount = mockRequirementsNotMet.length;

  return (
    <StyledButton onClick={onClick} $data={dataCount}>
      <Button
        iconBefore={<MdCheckCircleOutline />}
        appearance="gray"
        variant="outlined"
        spacing="compact"
      >
        {dataButtonRequirements.requirements}
      </Button>
    </StyledButton>
  );
}
