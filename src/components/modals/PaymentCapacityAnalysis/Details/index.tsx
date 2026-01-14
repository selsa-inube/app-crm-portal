import { EnumType } from "@hooks/useEnum/useEnum";

import { Divider, Stack, Text } from "@inubekit/inubekit";
import { BaseModal } from "../../baseModal";
import { DataCapacityAnalysisDetails } from "./config";

interface IPaymentCapacityAnalysisDetailsProps {
  isMobile: boolean;
  lang: EnumType;
  initialValues: {
    concept: string;
    income: string;
    reserve: string;
    value: string;
  };
  handleClose: () => void;
}

export const PaymentCapacityAnalysisDetails = (
  props: IPaymentCapacityAnalysisDetailsProps,
) => {
  const { isMobile, lang, initialValues, handleClose } = props;

  return (
    <BaseModal
      title={DataCapacityAnalysisDetails.modalTitle.i18n[lang]}
      nextButton={DataCapacityAnalysisDetails.closeButton.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "290px" : "335px"}
    >
      <Stack direction="column" gap="8px">
        <Text>{initialValues.concept.replace("(+)", "")}</Text>
        <Divider dashed />
        <Stack justifyContent="space-between">
          <Text
            type="body"
            size={isMobile ? "small" : "medium"}
            appearance="gray"
          >
            {DataCapacityAnalysisDetails.income.i18n[lang]}
          </Text>
          <Stack gap="4px">
            <Text
              type="body"
              size={isMobile ? "small" : "medium"}
              weight="bold"
              appearance="success"
            >
              $
            </Text>
            <Text type="body" size={isMobile ? "small" : "medium"}>
              {initialValues.income}
            </Text>
          </Stack>
        </Stack>
        <Stack justifyContent="space-between">
          <Text
            type="body"
            size={isMobile ? "small" : "medium"}
            appearance="gray"
          >
            {DataCapacityAnalysisDetails.reservePercentage.i18n[lang]}
          </Text>
          <Stack gap="4px">
            <Text type="body" size={isMobile ? "small" : "medium"}>
              {initialValues.reserve}
            </Text>
          </Stack>
        </Stack>
        <Stack justifyContent="space-between">
          <Text
            type="body"
            size={isMobile ? "small" : "medium"}
            appearance="gray"
            weight="bold"
          >
            {DataCapacityAnalysisDetails.availableValue.i18n[lang]}
          </Text>
          <Stack gap="4px">
            <Text
              type="body"
              size={isMobile ? "small" : "medium"}
              weight="bold"
              appearance="success"
            >
              $
            </Text>
            <Text type="body" size={isMobile ? "small" : "medium"}>
              {initialValues.value}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </BaseModal>
  );
};
