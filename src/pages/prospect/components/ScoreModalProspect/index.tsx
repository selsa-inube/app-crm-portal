import { useEffect, useState, useCallback } from "react";
import { useFlag } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum/useEnum";
import { creditConsultationInBuroByIdentificationNumber } from "@services/creditRiskBureauQueries/creditConsultationInBuroByIdentificationNumber";
import { updateCreditRiskBureauQuery } from "@services/creditRiskBureauQueries/updateCreditRiskBureauQuery";
import {
  ICreditRiskBureauQuery,
  IUpdateCreditRiskBureauQuery,
} from "@services/creditRiskBureauQueries/types";
import { useToken } from "@hooks/useToken";

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
}
export const ScoreModalProspect = (props: IScoreModalProspectProps) => {
  const {
    isMobile,
    lang,
    handleClose,
    customerPublicCode,
    businessUnitPublicCode,
    businessManagerCode,
    setShowMessageSuccessModal,
    setMessageError,
  } = props;

  const { addFlag } = useFlag();
  const { getAuthorizationToken } = useToken();

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
      const authorizationToken = await getAuthorizationToken();

      const data = await creditConsultationInBuroByIdentificationNumber(
        businessUnitPublicCode,
        businessManagerCode,
        customerPublicCode,
        authorizationToken,
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
      setShowMessageSuccessModal(true);
      setMessageError(description);
    }
  }, [customerPublicCode, businessUnitPublicCode, businessManagerCode]);

  const handleSave = async () => {
    setIsLoadingSubmit(true);
    try {
      if (newFirstScore && firstScore && newFirstScore.score !== null) {
        const payload: IUpdateCreditRiskBureauQuery = {
          ...firstScore,
          creditRiskScore: newFirstScore.score,
          queryDate: new Date().toISOString(),
          modifyJustification: riskScoreChanges.justification.i18n[lang],
        };

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
          queryDate: new Date().toISOString(),
          modifyJustification: riskScoreChanges.justification.i18n[lang],
        };

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
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      setShowMessageSuccessModal(true);
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
              isActive: firstScore.isActive === "1",
            }
          : null
      }
      secondScore={
        secondScore
          ? {
              score: secondScore.creditRiskScore,
              date: secondScore.queryDate,
              bureauName: secondScore.bureauName,
              isActive: secondScore.isActive === "1",
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
