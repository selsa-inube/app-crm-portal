import { useEffect, useState } from "react";
import { Stack } from "@inubekit/inubekit";

import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";
import { Fieldset } from "@components/data/Fieldset";
import { patchValidateRequirements } from "@services/validateRequirements";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospects/types";

import { IValidateRequirement } from "@services/validateRequirements/types";

interface IRequirementsNotMetProps {
  isMobile: boolean;
  customerData: ICustomerData;
  prospectData: IProspect;
}

export function RequirementsNotMet(props: IRequirementsNotMetProps) {
  const { isMobile, customerData, prospectData } = props;

  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);

  const payload = {
    clientIdentificationNumber: customerData?.customerId ?? "",
    prospect: {
      ...prospectData,
    },
  };

  const handleSubmit = async () => {
    try {
      const data = await patchValidateRequirements(payload);
      if (data) {
        setValidateRequirements(data);
      }
    } catch (error) {
      console.error("Error al validar requisitos:", error);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [customerData]);

  return (
    <Fieldset>
      <Stack
        gap="16px"
        margin={isMobile ? "8px" : "16px"}
        direction={isMobile ? "column" : "row"}
        wrap="wrap"
        height={isMobile ? "auto" : "324px"}
      >
        {validateRequirements.map((requirementData, index) => (
          <UnfulfilledRequirements
            key={index}
            title={requirementData.requirementName}
            isMobile={isMobile}
            requirement={requirementData.requirementStatus}
            causeNonCompliance={
              requirementData.descriptionEvaluationRequirement
            }
          />
        ))}
      </Stack>
    </Fieldset>
  );
}
