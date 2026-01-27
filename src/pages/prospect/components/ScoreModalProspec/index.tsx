import { useEffect, useState, useCallback } from "react";

import { EnumType } from "@hooks/useEnum/useEnum";
import { creditConsultationInBuroByIdentificationNumber } from "@services/creditRiskBureauQueries";
import { useToken } from "@hooks/useToken";

import { ScoreModalProspectUI } from "./interface";
import { IScore } from "./types";

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
  const { getAuthorizationToken } = useToken();

  const [firstScore, setFirstScore] = useState<IScore | null>(null);
  const [secondScore, setSecondScore] = useState<IScore | null>(null);
  const [newFirstScore, setNewFirstScore] = useState<IScore | null>(null);
  const [newSecondScore, setNewSecondScore] = useState<IScore | null>(null);

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
        if (data[0]) {
          setFirstScore({
            score: data[0].creditRiskScore,
            date: data[0].queryDate,
            bureauName: data[0].bureauName,
            isActive: data[0].isActive === "1",
          });
        }

        if (data[1]) {
          setSecondScore({
            score: data[1].creditRiskScore,
            date: data[1].queryDate,
            bureauName: data[1].bureauName,
            isActive: data[1].isActive === "1",
          });
        }
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

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return (
    <ScoreModalProspectUI
      isMobile={isMobile}
      firstScore={firstScore}
      secondScore={secondScore}
      handleClose={handleClose}
      setNewFirstScore={setNewFirstScore}
      setNewSecondScore={setNewSecondScore}
      newFirstScore={newFirstScore}
      newSecondScore={newSecondScore}
      lang={lang}
    />
  );
};
