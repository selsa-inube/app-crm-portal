import { Stack } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { BaseModal } from "@components/modals/baseModal";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataTrace } from "./config";

export interface ITraceDetailsModalProps {
  handleClose: () => void;
  lang: EnumType;
  data: { evaluation: string; description: string };
  isMobile?: boolean;
}

export function TraceDetailsModal(props: ITraceDetailsModalProps) {
  const { handleClose, data, isMobile, lang } = props;

  return (
    <BaseModal
      title={dataTrace.title.i18n[lang]}
      nextButton={dataTrace.understood.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "287px" : "402px"}
    >
      <Stack direction="column" gap="16px">
        <CardGray
          label={dataTrace.evaluation.i18n[lang]}
          placeHolder={data.evaluation}
          apparencePlaceHolder="gray"
        />
        <CardGray
          label={dataTrace.description.i18n[lang]}
          placeHolder={data.description}
          apparencePlaceHolder="gray"
          height="108px"
        />
      </Stack>
    </BaseModal>
  );
}
