import { Stack, useMediaQuery } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";
import { ITraceType } from "@services/creditRequest/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { txtLabels } from "./config";

export interface DetailsModalProps {
  data: ITraceType;
  lang: EnumType;
  portalId?: string;
  handleClose: () => void;
}

export function DetailsModal(props: DetailsModalProps) {
  const { data, portalId = "portal", lang, handleClose } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const node = document.getElementById(portalId);

  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }

  return (
    <BaseModal
      title={txtLabels.title.i18n[lang]}
      nextButton={txtLabels.buttonText.i18n[lang]}
      width={isMobile ? "287px" : "402px"}
      height={isMobile ? "auto" : "auto"}
      handleNext={handleClose}
      handleClose={handleClose}
    >
      <Stack direction="column" gap="16px">
        <CardGray
          label={txtLabels.userLabel.i18n[lang]}
          placeHolder={data.userName}
          apparencePlaceHolder="gray"
        />
        <CardGray
          label={txtLabels.justificationLabel.i18n[lang]}
          placeHolder={
            data.traceType === "Executed_task"
              ? data.justification
              : data.traceValue
          }
          apparencePlaceHolder="gray"
        />
      </Stack>
    </BaseModal>
  );
}
