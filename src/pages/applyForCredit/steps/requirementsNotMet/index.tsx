import { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { Stack, Text, Icon, Spinner } from "@inubekit/inubekit";

import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorModal } from "@components/modals/ErrorModal";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospect/types";
import { IValidateRequirement } from "@services/requirement/types";

import { dataError } from "./config";

interface IRequirementsNotMetProps {
  isMobile: boolean;
  customerData: ICustomerData;
  prospectData: IProspect;
  businessUnitPublicCode: string;
  businessManagerCode: string;
}

export function RequirementsNotMet(props: IRequirementsNotMetProps) {
  const {
    isMobile,
    customerData,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
  } = props;

  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!customerData?.customerId || !prospectData) return;

    const payload = {
      clientIdentificationNumber: customerData.customerId,
      prospect: { ...prospectData },
    };

    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await patchValidateRequirements(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );
        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [customerData, prospectData]);

  return (
    <>
      <Fieldset>
        {isLoading ? (
          <Stack
            gap="16px"
            padding="16px"
            margin={isMobile ? "8px" : "16px"}
            justifyContent="center"
            direction="column"
            alignItems="center"
          >
            <Spinner />
            <Text type="title" size="medium" appearance="dark">
              {dataError.loadRequirements}
            </Text>
          </Stack>
        ) : validateRequirements && validateRequirements.length > 0 ? (
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
                title={`${dataError.alert} ${index + 1}`}
                isMobile={isMobile}
                requirement={requirementData.requirementName}
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
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            setShowErrorModal(false);
          }}
          isMobile={isMobile}
          message={dataError.descriptionError}
        />
      )}
    </>
  );
}
