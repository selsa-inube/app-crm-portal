import { useEffect, useState } from "react";
import { useFlag, Stack, Icon, Text } from "@inubekit/inubekit";
import { MdCheckCircleOutline } from "react-icons/md";

import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospects/types";
import { patchValidateRequirements } from "@services/validateRequirements";
import { IValidateRequirement } from "@services/validateRequirements/types";

import { BaseModal } from "@components/modals/baseModal";
import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";

import { dataError, dataRequirementsNotMet } from "./config";
import { ScrollableContainer } from "./styles";

export interface IRequirementsModalProps {
  handleClose: () => void;
  isMobile: boolean;
  customerData: ICustomerData;
  prospectData: IProspect;
}

export function RequirementsModal(props: IRequirementsModalProps) {
  const { isMobile, customerData, prospectData, handleClose } = props;

  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);

  const { addFlag } = useFlag();

  useEffect(() => {
    if (!customerData?.customerId || !prospectData) return;

    const payload = {
      clientIdentificationNumber: customerData.customerId,
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

    handleSubmit();
  }, [customerData, prospectData]);

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
                isMobile={true}
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
      </ScrollableContainer>
    </BaseModal>
  );
}
