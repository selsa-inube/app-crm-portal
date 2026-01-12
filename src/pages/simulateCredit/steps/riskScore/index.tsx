import { useEffect, useState } from "react";
import { Button, Input, SkeletonLine, Stack, Text } from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdOutlineEdit } from "react-icons/md";

import { Fieldset } from "@components/data/Fieldset";
import { RiskScoreGauge } from "@pages/prospect/components/RiskScoreGauge";
import { formatPrimaryDate } from "@utils/formatData/date";
import { ErrorModal } from "@components/modals/ErrorModal";
import { BaseModal } from "@components/modals/baseModal";
import { EnumType } from "@hooks/useEnum/useEnum";

import { riskScoreData } from "./config";

interface IRiskScoreProps {
  value: number;
  date: string;
  isMobile: boolean;
  lang: EnumType;
  handleOnChange: (riskScore: { value: number; date: string }) => void;
}

export function RiskScore(props: IRiskScoreProps) {
  const { value, date, isMobile, lang, handleOnChange } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    score: Yup.number().required(""),
  });

  const formik = useFormik({
    initialValues: {
      score: value || riskScoreData.value.i18n[lang],
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
      value: value || riskScoreData.value.i18n[lang],
      date: date || riskScoreData.date.i18n[lang],
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fieldset>
      <Stack direction="column" alignItems="center" gap="20px">
        <RiskScoreGauge
          value={value || riskScoreData.value.i18n[lang]}
          lang={lang}
        />
        <Stack gap="4px">
          {isLoading ? (
            <SkeletonLine />
          ) : (
            <Text type="body" size="small">
              {riskScoreData.reportedScore.i18n[lang]}
            </Text>
          )}
          <Text type="body" weight="bold" size="small">
            {date === riskScoreData.date.i18n[lang]
              ? formatPrimaryDate(new Date())
              : formatPrimaryDate(new Date(date))}
          </Text>
        </Stack>
        <Stack direction="column" gap="12px">
          <Button
            variant="outlined"
            iconBefore={<MdOutlineEdit />}
            onClick={() => setShowEditModal(true)}
          >
            {riskScoreData.editScore.i18n[lang]}
          </Button>
          <Button variant="none" iconBefore={<MdOutlineEdit />}>
            {riskScoreData.restore.i18n[lang]}
          </Button>
        </Stack>
        {showErrorModal && (
          <ErrorModal
            handleClose={() => setShowErrorModal(false)}
            isMobile={isMobile}
            message={riskScoreData.error.i18n[lang]}
          />
        )}
        {showEditModal && (
          <BaseModal
            title={riskScoreData.editTitle.i18n[lang]}
            nextButton={riskScoreData.save.i18n[lang]}
            backButton={riskScoreData.close.i18n[lang]}
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
              label={riskScoreData.score.i18n[lang]}
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
              message={riskScoreData.error.i18n[lang]}
            />
          </BaseModal>
        )}
      </Stack>
    </Fieldset>
  );
}
