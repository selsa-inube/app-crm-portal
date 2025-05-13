import { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { Stack, Text, Icon, useFlag } from "@inubekit/inubekit";

import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";
import { Fieldset } from "@components/data/Fieldset";
import { patchValidateRequirements } from "@services/validateRequirements";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospects/types";
import { IValidateRequirement } from "@services/validateRequirements/types";

import { dataError } from "./config";

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

  const { addFlag } = useFlag();

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
      addFlag({
        title: dataError.titleError,
        description: dataError.descriptionError,
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [customerData]);

  return (
    <>
      <Fieldset>
        {validateRequirements && validateRequirements.length > 0 ? (
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
        ) : (
          <Stack
            gap="16px"
            padding="16px"
            margin={isMobile ? "8px" : "16px"}
            justifyContent="center"
            direction="column"
            alignItems="center"
          >
            <Icon
              icon={<MdCheckCircleOutline />}
              appearance={"success"}
              size="54px"
            />
            <Text type="title" size="medium" appearance="dark">
              {dataError.noData}
            </Text>
          </Stack>
        )}
      </Fieldset>
    </>
  );
}
