import { useEffect, useState } from "react";
import { Button, Stack, Text } from "@inubekit/inubekit";
import { MdOutlineEdit } from "react-icons/md";

import { Fieldset } from "@components/data/Fieldset";
import { RiskScoreGauge } from "@pages/prospect/components/RiskScoreGauge";
import { formatPrimaryDate } from "@utils/formatData/date";
import { ErrorModal } from "@components/modals/ErrorModal";

import { riskScoreData } from "./config";

interface IRiskScoreProps {
  value: number;
  date: string;
  isMobile: boolean;
  handleOnChange: (riskScore: { value: number; date: string }) => void;
}

export function RiskScore(props: IRiskScoreProps) {
  const { value, date, isMobile, handleOnChange } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    handleOnChange({
      value: value || riskScoreData.value,
      date: date || riskScoreData.date,
    });
  }, [value]);

  return (
    <Fieldset>
      <Stack direction="column" alignItems="center" gap="20px">
        <RiskScoreGauge value={value || riskScoreData.value} />
        <Stack gap="4px">
          <Text type="body" size="small">
            {riskScoreData.reportedScore}
          </Text>
          <Text type="body" weight="bold" size="small">
            {date === riskScoreData.date
              ? riskScoreData.date
              : formatPrimaryDate(new Date(date))}
          </Text>
        </Stack>
        <Button variant="outlined" iconBefore={<MdOutlineEdit />}>
          {riskScoreData.editScore}
        </Button>
        {showErrorModal && (
          <ErrorModal
            handleClose={() => {
              setShowErrorModal(false);
            }}
            isMobile={isMobile}
            message={"error"}
          />
        )}
      </Stack>
    </Fieldset>
  );
}
