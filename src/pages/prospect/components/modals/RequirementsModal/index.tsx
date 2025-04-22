import { BaseModal } from "@components/modals/baseModal";
import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";
import { mockRequirementsNotMet } from "@mocks/requirements-not-met/requirementsnotmet.mock";

import { dataRequirementsNotMet } from "./config";
import { ScrollableContainer } from "./styles";

export interface IRequirementsModalProps {
  handleClose: () => void;
  isMobile: boolean;
}

export function RequirementsModal(props: IRequirementsModalProps) {
  const { isMobile, handleClose } = props;

  return (
    <BaseModal
      title={dataRequirementsNotMet.title}
      nextButton={dataRequirementsNotMet.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px " : "402px"}
      height={isMobile ? "auto" : "652px"}
      finalDivider={true}
    >
      <ScrollableContainer $isMobile={isMobile}>
        {mockRequirementsNotMet.map((requirementData, index) => (
          <UnfulfilledRequirements
            key={index}
            requirement={requirementData.requirement}
            causeNonCompliance={requirementData.causeNonCompliance}
          />
        ))}
      </ScrollableContainer>
    </BaseModal>
  );
}
