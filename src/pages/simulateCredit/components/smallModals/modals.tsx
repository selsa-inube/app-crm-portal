import { MdWarningAmber } from "react-icons/md";
import { Divider, Icon, Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

import { textModals } from "./config";

interface IProps {
  handleNext: () => void;
  handleClose: () => void;
  isMobile: boolean;
}

export function AlertIncome(props: IProps) {
  const { handleNext, handleClose, isMobile } = props;

  return (
    <BaseModal
      title={textModals.titleAlert}
      nextButton={textModals.understood}
      apparenceNext="warning"
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "280px" : "402px"}
    >
      <Stack direction="column" gap="16px">
        <Stack justifyContent="center">
          <Icon
            icon={<MdWarningAmber />}
            appearance="warning"
            size="68px"
          ></Icon>
        </Stack>
        <Text type="body" size="medium" appearance="gray">
          {textModals.descriptionIncome}
        </Text>
        <Divider dashed />
        <Text type="body" size="medium">
          {textModals.includeIncome}
        </Text>
      </Stack>
    </BaseModal>
  );
}

export function AlertObligations(props: IProps) {
  const { handleNext, handleClose, isMobile } = props;

  return (
    <BaseModal
      title={textModals.titleAlert}
      nextButton={textModals.understood}
      apparenceNext="warning"
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "280px" : "412px"}
    >
      <Stack direction="column" gap="16px">
        <Stack justifyContent="center">
          <Icon
            icon={<MdWarningAmber />}
            appearance="warning"
            size="68px"
          ></Icon>
        </Stack>
        <Text type="body" size="medium" appearance="gray">
          {textModals.descriptionObligation}
        </Text>
        <Divider dashed />
        <Text type="body" size="medium">
          {textModals.includeObligation}
        </Text>
      </Stack>
    </BaseModal>
  );
}

export function AlertCreditLimit(props: IProps) {
  const { handleNext, handleClose, isMobile } = props;

  return (
    <BaseModal
      title={textModals.titleQuotas}
      nextButton={textModals.close}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "280px" : "450px"}
    >
      <Stack>
        <Text>{textModals.descriptionQuotas}</Text>
      </Stack>
    </BaseModal>
  );
}

export function AlertCapacityAnalysis(props: IProps) {
  const { handleNext, handleClose, isMobile } = props;

  return (
    <BaseModal
      title={textModals.titlePaymentCapacity}
      nextButton={textModals.close}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "280px" : "400px"}
    >
      <Stack>
        <Text>{textModals.descriptionPaymentCapacity}</Text>
      </Stack>
    </BaseModal>
  );
}
