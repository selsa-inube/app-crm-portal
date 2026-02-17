import { useEffect, useState, useCallback } from "react";
import { useFlag } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum/useEnum";
import { creditConsultationInBuroByIdentificationNumber } from "@services/creditRiskBureauQueries/creditConsultationInBuroByIdentificationNumber";
import { updateCreditRiskBureauQuery } from "@services/creditRiskBureauQueries/updateCreditRiskBureauQuery";
import {
  ICreditRiskBureauQuery,
  IUpdateCreditRiskBureauQuery,
} from "@services/creditRiskBureauQueries/types";
import { ICRMPortalData } from "@context/AppContext/types";

import { ScoreModalProspectUI } from "./interface";
import { IScore } from "./types";
import { riskScoreChanges, creditScoreChanges } from "./config";

interface IScoreModalProspectProps {
  isMobile: boolean;
  lang: EnumType;
  customerPublicCode: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  handleClose: () => void;
  setShowMessageSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  eventData: ICRMPortalData;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ScoreModalProspect = (props: IScoreModalProspectProps) => {
  const {
    isMobile,
    lang,
    handleClose,
    customerPublicCode,
    businessUnitPublicCode,
    businessManagerCode,
    setMessageError,
    eventData,
    setShowErrorModal,
  } = props;

  const { addFlag } = useFlag();

  const [newFirstScore, setNewFirstScore] = useState<IScore | null>(null);
  const [newSecondScore, setNewSecondScore] = useState<IScore | null>(null);
  const [firstScore, setFirstScore] = useState<ICreditRiskBureauQuery | null>(
    null,
  );
  const [secondScore, setSecondScore] = useState<ICreditRiskBureauQuery | null>(
    null,
  );
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const fetchScores = useCallback(async () => {
    if (!customerPublicCode) return;

    try {
      setIsLoadingSubmit(true);

      const data = await creditConsultationInBuroByIdentificationNumber(
        businessUnitPublicCode,
        businessManagerCode,
        customerPublicCode,
        eventData.token,
      );

      if (data && data.length > 0) {
        if (data[0]) setFirstScore(data[0]);
        if (data[1]) setSecondScore(data[1]);
      }
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      setIsLoadingSubmit(false);
    }
  }, [customerPublicCode, businessUnitPublicCode, businessManagerCode]);

  const handleSave = async () => {
    setIsLoadingSubmit(true);
    try {
      if (newFirstScore && firstScore && newFirstScore.score !== null) {
        const payload: IUpdateCreditRiskBureauQuery = {
          ...firstScore,
          creditRiskScore: newFirstScore.score,
          queryDate: new Date(newFirstScore.date).toISOString(),
          modifyJustification: riskScoreChanges.justification.i18n[lang],
        };

        delete payload.creditRiskBureauQueryId;

        await updateCreditRiskBureauQuery(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );
      }

      if (newSecondScore && secondScore && newSecondScore.score !== null) {
        const payload: IUpdateCreditRiskBureauQuery = {
          ...secondScore,
          creditRiskScore: newSecondScore.score,
          queryDate: new Date(newSecondScore.date).toISOString(),
          modifyJustification: riskScoreChanges.justification.i18n[lang],
        };

        delete payload.creditRiskBureauQueryId;

        await updateCreditRiskBureauQuery(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );
      }

      handleClose();

      addFlag({
        title: creditScoreChanges.title.i18n[lang],
        description: creditScoreChanges.description.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      console.log(error);
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return (
    <ScoreModalProspectUI
      isMobile={isMobile}
      firstScore={
        firstScore
          ? {
              score: firstScore.creditRiskScore,
              date: firstScore.queryDate,
              bureauName: firstScore.bureauName,
              isActive: firstScore.isActive === "Y",
            }
          : null
      }
      secondScore={
        secondScore
          ? {
              score: secondScore.creditRiskScore,
              date: secondScore.queryDate,
              bureauName: secondScore.bureauName,
              isActive: secondScore.isActive === "Y",
            }
          : null
      }
      handleClose={handleClose}
      setNewFirstScore={setNewFirstScore}
      setNewSecondScore={setNewSecondScore}
      newFirstScore={newFirstScore}
      newSecondScore={newSecondScore}
      lang={lang}
      handleSave={handleSave}
      isLoadingSubmit={isLoadingSubmit}
    />
  );
};
