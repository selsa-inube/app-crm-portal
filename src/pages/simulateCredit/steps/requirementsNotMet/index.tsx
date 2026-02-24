import { useEffect, useState, useContext } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { Stack, Text, Icon } from "@inubekit/inubekit";

import { UnfulfilledRequirements } from "@components/cards/UnfulfilledRequirements";
import { Fieldset } from "@components/data/Fieldset";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospect/types";
import { IValidateRequirement } from "@services/requirement/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { AppContext } from "@context/AppContext";
import { IAllEnumsResponse } from "@services/enumerators/types";

import { dataError, excludedStatus, warningStatusExcluded } from "./config";

interface IRequirementsNotMetProps {
  isMobile: boolean;
  customerData: ICustomerData;
  prospectData: IProspect;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  lang: EnumType;
  enums: IAllEnumsResponse;
}

export function RequirementsNotMet(props: IRequirementsNotMetProps) {
  const {
    isMobile,
    customerData,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    lang,
    enums,
  } = props;

  const { eventData } = useContext(AppContext);

  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!customerData?.customerId || !prospectData) return;

    const payload = {
      clientIdentificationNumber: customerData.publicCode,
      prospect: { ...prospectData },
    };

    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await patchValidateRequirements(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
          eventData.token,
        );
        if (data) {
          setValidateRequirements(
            data.filter((requirement) => {
              return (
                !excludedStatus.includes(requirement.requirementStatus) &&
                !warningStatusExcluded.includes(requirement.requirementStatus)
              );
            }),
          );
        }
      } catch (error) {
        setHasError(true);
        setShowErrorModal(true);
        showErrorModal;
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, []);

  return (
    <>
      <Fieldset>
        {isLoading ? (
          <Stack
            gap="16px"
            margin={isMobile ? "8px" : "16px"}
            direction={isMobile ? "column" : "row"}
            wrap="wrap"
            height={isMobile ? "auto" : "324px"}
          >
            {[1, 2, 3].map((index) => (
              <UnfulfilledRequirements
                key={index}
                title={`${dataError.alert.i18n[lang]} ${index}`}
                isMobile={isMobile}
                requirement=""
                causeNonCompliance=""
                isLoading={true}
                lang={lang}
              />
            ))}
          </Stack>
        ) : validateRequirements && validateRequirements.length > 0 ? (
          <Stack
            gap="16px"
            margin={isMobile ? "8px" : "16px"}
            direction={isMobile ? "column" : "row"}
            wrap="wrap"
            height={isMobile ? "auto" : "324px"}
          >
            {validateRequirements.map((requirementData, index) => {
              const matchedRequirement = enums?.Requirement?.find(
                (req) => req.code === requirementData.requirementName,
              );
              const requirementLabel =
                matchedRequirement?.i18n?.[lang] ??
                requirementData.requirementName;

              return (
                <UnfulfilledRequirements
                  key={index}
                  title={`${dataError.alert.i18n[lang]} ${index + 1}`}
                  isMobile={isMobile}
                  requirement={requirementLabel}
                  causeNonCompliance={
                    requirementData.descriptionEvaluationRequirement
                  }
                  hasError={hasError}
                  isLoading={false}
                  lang={lang}
                />
              );
            })}
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
            {!hasError && (
              <Icon
                icon={<MdCheckCircleOutline />}
                appearance={"success"}
                size="54px"
              />
            )}
            <Text type="title" size="medium" appearance="dark">
              {hasError
                ? dataError.descriptionError.i18n[lang]
                : dataError.noData.i18n[lang]}
            </Text>
          </Stack>
        )}
      </Fieldset>
    </>
  );
}
