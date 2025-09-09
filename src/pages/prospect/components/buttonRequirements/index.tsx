import { MdOutlineRule } from "react-icons/md";
import { Button } from "@inubekit/inubekit";

import { StyledButton } from "./styles";
import { dataButtonRequirements } from "./config";

interface IButtonRequirementsProps {
  dataCount: number;
  onClick: () => void;
}

export function ButtonRequirements(props: IButtonRequirementsProps) {
  const { dataCount, onClick } = props;

  return (
    <StyledButton onClick={onClick} $data={dataCount}>
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
