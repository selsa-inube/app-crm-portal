import { MdOutlineRule } from "react-icons/md";
import { Button } from "@inubekit/inubekit";

import { IValidateRequirement } from "@services/requirement/types";

import { StyledButton } from "./styles";
import { dataButtonRequirements } from "./config";

interface IButtonRequirementsProps {
  data: IValidateRequirement[];
  onClick: () => void;
}

export function ButtonRequirements(props: IButtonRequirementsProps) {
  const { data, onClick } = props;

  const onlyNotApprubed = data.filter(
    (requirement) => requirement.requirementStatus !== "Aprobado",
  );
  const dataCount = onlyNotApprubed.length;

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
