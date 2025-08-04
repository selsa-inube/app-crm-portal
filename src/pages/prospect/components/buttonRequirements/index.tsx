import { MdOutlineRule } from "react-icons/md";
import { Button } from "@inubekit/inubekit";

import { StyledButton } from "./styles";
import { dataButtonRequirements } from "./config";

interface IButtonRequirementsProps {
  onClick: () => void;
  unmetRequirementsAmount?: number;
}

export function ButtonRequirements(props: IButtonRequirementsProps) {
  const { onClick, unmetRequirementsAmount } = props;

  return (
    <StyledButton onClick={onClick} $data={unmetRequirementsAmount}>
      <Button
        iconBefore={<MdOutlineRule />}
        appearance="gray"
        variant="outlined"
        spacing="compact"
      >
        {dataButtonRequirements.requirements}
      </Button>
    </StyledButton>
  );
}
