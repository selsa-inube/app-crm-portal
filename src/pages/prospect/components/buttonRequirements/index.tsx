import { MdOutlineRule } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { IValidateRequirement } from "@services/requirement/types";

import { StyledButton } from "./styles";

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
      <Icon
        icon={<MdOutlineRule />}
        appearance="gray"
        size="28px"
        spacing="compact"
        variant="outlined"
      />
    </StyledButton>
  );
}
