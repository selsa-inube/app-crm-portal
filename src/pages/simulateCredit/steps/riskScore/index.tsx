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
import { EnumType } from "@hooks/useEnum/useEnum";
import { EUpdateMethod } from "@services/creditRiskBureauQueries/types";
import { ICreditRiskBureauUpdateMethod } from "@services/creditRiskBureauQueries/types";

import { riskScoreData } from "./config";

interface IRiskScoreProps {
  value: number;
  date: string;
  isMobile: boolean;
  lang: EnumType;
  isLoadingUpdate?: boolean;
  handleOnChange: (riskScore: { value: number; date: string }) => void;
  logo?: string;
  resetScore?: (methods: ICreditRiskBureauUpdateMethod[]) => Promise<void>;
  newScore?: number | null;
  isProspect?: boolean;
  updateMethod?: EUpdateMethod;
  onRefresh?: () => void;
}

export function RiskScore(props: IRiskScoreProps) {
  const {
    value,
    date,
    isMobile,
    lang,
    handleOnChange,
    logo,
    isLoadingUpdate = false,
    updateMethod = EUpdateMethod.Manual,
    onRefresh,
  } = props;
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(isLoadingUpdate);

  const validationSchema = Yup.object({
    score: Yup.number().required(""),
  });

  const formik = useFormik({
    initialValues: {
      score: value,
      date: date,
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    if (updateMethod === EUpdateMethod.Automatic) {
      setShowConfirmModal(true);
    } else {
      setShowEditModal(true);
    }
  };

  const handleConfirmAutomatic = () => {
    setShowConfirmModal(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Fieldset>
      <Stack direction="column" alignItems="center" gap="20px">
        <RiskScoreGauge value={value} lang={lang} logo={logo} />
        <Stack gap="4px">
          {isLoading ? (
            <SkeletonLine />
          ) : (
            <Text type="body" size="small">
              {riskScoreData.reportedScore.i18n[lang]}
            </Text>
          )}
          <Text type="body" weight="bold" size="small">
            {date
              ? formatPrimaryDate(new Date())
              : formatPrimaryDate(new Date(date))}
          </Text>
        </Stack>
        <Stack gap="12px" direction="column" alignItems="center">
          <Button
            variant="outlined"
            iconBefore={<MdOutlineEdit />}
            onClick={() => handleButtonClick()}
          >
            {riskScoreData.editScore.i18n[lang]}
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
        {showConfirmModal && (
          <BaseModal
            title={riskScoreData.automaticUpdateTitle.i18n[lang]}
            nextButton={riskScoreData.confirm.i18n[lang]}
            backButton={riskScoreData.cancel.i18n[lang]}
            handleBack={() => setShowConfirmModal(false)}
            handleNext={handleConfirmAutomatic}
            width={isMobile ? "300px" : "400px"}
          >
            <Text>{riskScoreData.automaticUpdateMessage.i18n[lang]}</Text>
          </BaseModal>
        )}
      </Stack>
    </Fieldset>
  );
}
