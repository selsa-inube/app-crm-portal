import { useEffect, useState } from "react";
import { Button, Input, Stack, Text } from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdOutlineEdit } from "react-icons/md";

import { Fieldset } from "@components/data/Fieldset";
import { RiskScoreGauge } from "@pages/prospect/components/RiskScoreGauge";
import { formatPrimaryDate } from "@utils/formatData/date";
import { ErrorModal } from "@components/modals/ErrorModal";
import { BaseModal } from "@components/modals/baseModal";

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
  const [showEditModal, setShowEditModal] = useState(false);

  const validationSchema = Yup.object({
    score: Yup.number().required(""),
  });

  const formik = useFormik({
    initialValues: {
      score: value || riskScoreData.value,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const num = Number(values.score);

      handleOnChange({
        value: num,
        date: new Date().toISOString(),
      });

      setShowEditModal(false);
    },
  });

  useEffect(() => {
    handleOnChange({
      value: value || riskScoreData.value,
      date: date || riskScoreData.date,
    });
  }, []);

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
              ? formatPrimaryDate(new Date())
              : formatPrimaryDate(new Date(date))}
          </Text>
        </Stack>
        <Button
          variant="outlined"
          iconBefore={<MdOutlineEdit />}
          onClick={() => setShowEditModal(true)}
        >
          {riskScoreData.editScore}
        </Button>
        {showErrorModal && (
          <ErrorModal
            handleClose={() => setShowErrorModal(false)}
            isMobile={isMobile}
            message={riskScoreData.error}
          />
        )}
        {showEditModal && (
          <BaseModal
            title={riskScoreData.editTitle}
            nextButton={riskScoreData.save}
            backButton={riskScoreData.close}
            handleBack={() => setShowEditModal(false)}
            handleNext={formik.handleSubmit}
            disabledNext={
              formik.values.score > 950 || formik.values.score < 150
            }
            width={isMobile ? "300px" : "400px"}
          >
            <Input
              id="score"
              name="score"
              label={riskScoreData.score}
              size="compact"
              fullwidth
              type="number"
              value={formik.values.score}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              status={
                formik.values.score > 950 || formik.values.score < 150
                  ? "invalid"
                  : undefined
              }
              message={riskScoreData.error}
            />
          </BaseModal>
        )}
      </Stack>
    </Fieldset>
  );
}
