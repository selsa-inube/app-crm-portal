import { MdWarningAmber } from "react-icons/md";
import { Divider, Icon, Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { EnumType } from "@hooks/useEnum/useEnum";

import { textModals } from "./config";

interface IProps {
  handleNext: () => void;
  handleClose: () => void;
  isMobile: boolean;
  lang: EnumType;
  incomes?: boolean;
}

export function AlertIncome(props: IProps) {
  const { handleNext, handleClose, isMobile, lang } = props;

  return (
    <BaseModal
      title={textModals.titleAlert.i18n[lang]}
      nextButton={textModals.understood.i18n[lang]}
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
          {textModals.descriptionIncome.i18n[lang]}
        </Text>
        <Divider dashed />
        <Text type="body" size="medium">
          {textModals.includeIncome.i18n[lang]}
        </Text>
      </Stack>
    </BaseModal>
  );
}

export function AlertObligations(props: IProps) {
  const { handleNext, handleClose, isMobile, lang } = props;

  return (
    <BaseModal
      title={textModals.titleAlert.i18n[lang]}
      nextButton={textModals.understood.i18n[lang]}
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
          {textModals.descriptionObligation.i18n[lang]}
        </Text>
        <Divider dashed />
        <Text type="body" size="medium">
          {textModals.includeObligation.i18n[lang]}
        </Text>
      </Stack>
    </BaseModal>
  );
}

export function AlertCreditLimit(props: IProps) {
  const { handleNext, handleClose, isMobile, lang, incomes } = props;

  return (
    <BaseModal
      title={textModals.titleQuotas.i18n[lang]}
      nextButton={textModals.close.i18n[lang]}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "280px" : "450px"}
    >
      <Stack>
        <Text>
          {incomes
            ? textModals.descriptionQuotasIncome.i18n[lang]
            : textModals.descriptionQuotas.i18n[lang]}
        </Text>
      </Stack>
    </BaseModal>
  );
}

export function AlertCapacityAnalysis(props: IProps) {
  const { handleNext, handleClose, isMobile, lang } = props;

  return (
    <BaseModal
      title={textModals.titlePaymentCapacity.i18n[lang]}
      nextButton={textModals.close.i18n[lang]}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "280px" : "400px"}
    >
      <Stack>
        <Text>{textModals.descriptionPaymentCapacity.i18n[lang]}</Text>
      </Stack>
    </BaseModal>
  );
}
