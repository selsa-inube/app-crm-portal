import { Stack } from "@inubekit/inubekit";

import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";
import { Fieldset } from "@components/data/Fieldset";

import { dataNotMet } from "./config";

interface IRequirementsNotMetProps {
  isMobile: boolean;
}

export function RequirementsNotMet(props: IRequirementsNotMetProps) {
  const { isMobile } = props;

  return (
    <Fieldset>
      <Stack
        gap="16px"
        margin={isMobile ? "8px" : "16px"}
        direction={isMobile ? "column" : "row"}
      >
        {dataNotMet.map((requirementData, index) => (
          <UnfulfilledRequirements
            key={index}
            title={requirementData.title}
            isMobile={isMobile}
            requirement={requirementData.requirement}
            causeNonCompliance={requirementData.causeNonCompliance}
          />
        ))}
      </Stack>
    </Fieldset>
  );
}
