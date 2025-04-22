import { Stack } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { BaseModal } from "@components/modals/baseModal";

import { dataTrace } from "./config";

export interface ITraceDetailsModalProps {
  handleClose: () => void;
  data: { evaluation: string; description: string };
  isMobile?: boolean;
}

export function TraceDetailsModal(props: ITraceDetailsModalProps) {
  const { handleClose, data, isMobile } = props;

  return (
    <BaseModal
      title={dataTrace.title}
      nextButton={dataTrace.understood}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "287px" : "402px"}
    >
      <Stack direction="column" gap="16px">
        <CardGray
          label={dataTrace.evaluation}
          placeHolder={data.evaluation}
          apparencePlaceHolder="gray"
        />
        <CardGray
          label={dataTrace.description}
          placeHolder={data.description}
          apparencePlaceHolder="gray"
          height="108px"
        />
      </Stack>
    </BaseModal>
  );
}
