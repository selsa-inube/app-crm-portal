import { useState, useEffect } from "react";
import { Button, Input, Stack, Text, SkeletonLine } from "@inubekit/inubekit";
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
  logo?: string;
  resetScore?: () => void;
  newScore?: number | null;
  isProspect?: boolean;
}

export function RiskScore(props: IRiskScoreProps) {
  const {
    value,
    date,
    isMobile,
    handleOnChange,
    logo,
    resetScore,
    isProspect = false,
  } = props;
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newScore, setNewScore] = useState<number | null>(null);

  const validationSchema = Yup.object({
    score: Yup.number().required(""),
  });

  const formik = useFormik({
    initialValues: {
      score: value || riskScoreData.value,
      date: date || riskScoreData.date,
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
      setNewScore(num);
    },
  });

  useEffect(() => {
    if (!isProspect) {
      handleOnChange({
        value: value || riskScoreData.value,
        date: date || riskScoreData.date,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    if (resetScore) resetScore();
    setNewScore(null);
  };

  return (
    <Fieldset>
      <Stack direction="column" alignItems="center" gap="20px">
        <RiskScoreGauge value={value || riskScoreData.value} logo={logo} />
        <Stack gap="4px">
          {isLoading ? (
            <SkeletonLine />
          ) : (
            <Text type="body" size="small">
              {riskScoreData.reportedScore}
            </Text>
          )}
          <Text type="body" weight="bold" size="small">
            {date === riskScoreData.date
              ? formatPrimaryDate(new Date())
              : formatPrimaryDate(new Date(date))}
          </Text>
        </Stack>
        <Stack gap="12px" direction="column" alignItems="center">
          <Button
            variant="outlined"
            iconBefore={<MdOutlineEdit />}
            onClick={() => setShowEditModal(true)}
          >
            {riskScoreData.editScore}
          </Button>

          <Button variant="none" onClick={handleReset} disabled={!newScore}>
            {riskScoreData.reset}
          </Button>
        </Stack>
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
